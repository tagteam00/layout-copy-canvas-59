
/**
 * Utility functions for handling image compression and manipulation
 */

/**
 * Compresses an image file to a target size (100KB by default)
 * @param file The original image file
 * @param maxSizeKB Maximum file size in kilobytes
 * @returns Promise containing the compressed image as a Blob
 */
export const compressImage = async (file: File, maxSizeKB: number = 100): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate the width and height, preserving aspect ratio
        const aspectRatio = width / height;
        
        // Start with reasonable dimensions
        if (width > 1200) {
          width = 1200;
          height = Math.round(width / aspectRatio);
        }
        
        if (height > 1200) {
          height = 1200;
          width = Math.round(height * aspectRatio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with high quality
        let quality = 0.9;
        const getBlob = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }
              
              // If the size is within our target, we're done
              if (blob.size <= maxSizeKB * 1024) {
                resolve(blob);
                return;
              }
              
              // If the quality is already at the minimum acceptable, resolve anyway
              if (quality <= 0.3) {
                console.warn('Could not compress image enough, returning best effort');
                resolve(blob);
                return;
              }
              
              // Reduce quality and try again
              quality -= 0.1;
              getBlob();
            },
            'image/jpeg',
            quality
          );
        };
        
        getBlob();
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Create a file object from a blob with a specific name
 * @param blob Compressed image blob
 * @param fileName Original file name
 * @returns File object ready for upload
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  // Extract file extension
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  // Create new file name with original extension
  const newFileName = `${fileName.split('.')[0]}.${fileExtension}`;
  return new File([blob], newFileName, { type: blob.type });
};
