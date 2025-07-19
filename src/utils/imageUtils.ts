
/**
 * Simplified image utilities for iOS compatibility
 */

/**
 * Simple image compression using canvas (iOS-safe)
 */
export const compressImage = async (file: File, maxSizeKB: number = 100): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
              }
              
              // Simple resize logic
              let { width, height } = img;
              const maxDim = 800;
              
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = (height * maxDim) / width;
                  width = maxDim;
                } else {
                  width = (width * maxDim) / height;
                  height = maxDim;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    reject(new Error('Failed to create blob'));
                  }
                },
                'image/jpeg',
                0.8
              );
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = event.target?.result as string;
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Create a file object from a blob
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  const newFileName = `${fileName.split('.')[0]}.${fileExtension}`;
  return new File([blob], newFileName, { type: blob.type });
};
