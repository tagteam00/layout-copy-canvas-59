
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">TagTeam Design System</h1>
      
      {/* Color Palette */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        
        <h3 className="text-lg font-medium mb-2">Primary</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          <ColorSwatch color="primary-50" label="50" />
          <ColorSwatch color="primary-100" label="100" />
          <ColorSwatch color="primary-300" label="300" />
          <ColorSwatch color="primary-400" label="400" />
          <ColorSwatch color="primary-500" label="500" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Secondary</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          <ColorSwatch color="secondary-50" label="50" />
          <ColorSwatch color="secondary-100" label="100" />
          <ColorSwatch color="secondary-300" label="300" />
          <ColorSwatch color="secondary-400" label="400" />
          <ColorSwatch color="secondary-500" label="500" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Gray</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          <ColorSwatch color="gray-100" label="100" />
          <ColorSwatch color="gray-300" label="300" />
          <ColorSwatch color="gray-500" label="500" />
          <ColorSwatch color="gray-700" label="700" />
          <ColorSwatch color="gray-900" label="900" />
        </div>

        <h3 className="text-lg font-medium mb-2">Feedback</h3>
        <div className="grid grid-cols-4 gap-2">
          <ColorSwatch color="success" label="Success" />
          <ColorSwatch color="warning" label="Warning" />
          <ColorSwatch color="error" label="Error" />
          <ColorSwatch color="info" label="Info" />
        </div>
      </section>
      
      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        
        <div className="space-y-4">
          <div>
            <h1>Heading 1</h1>
            <p className="text-sm text-muted-foreground">text-3xl / text-4xl (mobile/desktop)</p>
          </div>
          <div>
            <h2>Heading 2</h2>
            <p className="text-sm text-muted-foreground">text-2xl / text-3xl</p>
          </div>
          <div>
            <h3>Heading 3</h3>
            <p className="text-sm text-muted-foreground">text-xl / text-2xl</p>
          </div>
          <div>
            <h4>Heading 4</h4>
            <p className="text-sm text-muted-foreground">text-lg / text-xl</p>
          </div>
          <div>
            <h5>Heading 5</h5>
            <p className="text-sm text-muted-foreground">text-base / text-lg</p>
          </div>
          <div>
            <h6>Heading 6</h6>
            <p className="text-sm text-muted-foreground">text-sm / text-base</p>
          </div>
          <div>
            <p className="text-base">Body text is set in Hanken Grotesk at 16px (1rem)</p>
          </div>
          <div>
            <small>Small text is set at 14px (0.875rem)</small>
          </div>
        </div>
      </section>
      
      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Spacing System</h2>
        
        <div className="space-y-2">
          <SpacingSwatch size={2} label="0.5rem (8px)" />
          <SpacingSwatch size={4} label="1rem (16px)" />
          <SpacingSwatch size={6} label="1.5rem (24px)" />
          <SpacingSwatch size={8} label="2rem (32px)" />
          <SpacingSwatch size={12} label="3rem (48px)" />
        </div>
      </section>
      
      {/* Component Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Button Variants</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Button Sizes</h3>
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><span>+</span></Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Badge Variants</h3>
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="bg-primary-100 text-primary-800">Custom</Badge>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Card Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium">Default Card</h3>
            <p className="text-muted-foreground">This is a default card from the design system.</p>
          </Card>
          
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-medium">Elevated Card</h3>
            <p className="text-muted-foreground">This card has a medium shadow for emphasis.</p>
          </Card>
          
          <Card className="p-4 border-2 shadow-none">
            <h3 className="text-lg font-medium">Outlined Card</h3>
            <p className="text-muted-foreground">This card has a thicker border and no shadow.</p>
          </Card>
          
          <Card className="p-4 bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-medium">Brand Card</h3>
            <p className="text-muted-foreground">This card uses brand colors.</p>
          </Card>
        </div>
      </section>
      
      {/* Accessibility */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Accessibility Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Focus States</h4>
            <div className="flex gap-2">
              <Button>Focus Me</Button>
              <a href="#" className="link-accessible">Accessible Link</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Color Contrast</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary p-4 text-primary-foreground rounded-md">
                Text on primary (WCAG AA compliant)
              </div>
              <div className="bg-secondary p-4 text-secondary-foreground rounded-md">
                Text on secondary (WCAG AA compliant)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div 
      className={`w-16 h-16 rounded-md shadow-sm bg-${color}`} 
      style={{ backgroundColor: `var(--${color})` }}
    />
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const SpacingSwatch = ({ size, label }: { size: number; label: string }) => (
  <div className="flex items-center">
    <div className={`bg-primary h-4 w-${size}`}></div>
    <span className="text-sm ml-4">{label}</span>
  </div>
);
