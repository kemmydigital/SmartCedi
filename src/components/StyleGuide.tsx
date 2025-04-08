import React from 'react';

export const StyleGuide = () => {
  return (
    <div className="container py-8 space-y-8">
      {/* Typography */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Heading 1</h1>
        <h2 className="text-3xl font-bold mb-4">Heading 2</h2>
        <h3 className="text-2xl font-bold mb-4">Heading 3</h3>
        <p className="text-base mb-4">Body text</p>
        <p className="text-sm text-muted-foreground">Small muted text</p>
      </div>

      {/* Colors */}
      <div className="flex gap-2">
        <div className="w-12 h-12 bg-primary rounded"></div>
        <div className="w-12 h-12 bg-secondary rounded"></div>
        <div className="w-12 h-12 bg-accent rounded"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-primary text-white rounded">Primary</button>
        <button className="px-4 py-2 bg-secondary text-white rounded">Secondary</button>
      </div>

      {/* Cards */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-2">Card Title</h3>
        <p className="text-muted-foreground">Card content goes here</p>
      </div>
    </div>
  );
};
