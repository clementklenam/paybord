// Comprehensive safe rendering utility to prevent React error #31
// This utility ensures that no objects are rendered directly in JSX

// Deep sanitization function to convert any object to primitive values
export const deepSanitize = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  
  // For objects, create a new sanitized version with only primitive values
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip MongoDB-specific properties
    if (key === '__v' || key === 'createdAt' || key === 'updatedAt' || key === 'customId') {
      continue;
    }
    
    if (value === null || value === undefined) {
      sanitized[key] = null;
    } else if (typeof value === 'object') {
      if (value instanceof Date) {
        sanitized[key] = value.toISOString();
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(deepSanitize);
      } else {
        // For nested objects, recursively sanitize
        sanitized[key] = deepSanitize(value);
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Safe string converter that handles any type
export const toSafeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (Array.isArray(value)) {
    return value.map(toSafeString).join(', ');
  }
  
  if (typeof value === 'object') {
    // For objects, try to extract a meaningful string representation
    if (value.name) return String(value.name);
    if (value.email) return String(value.email);
    if (value.id || value._id) return String(value.id || value._id);
    return '[Object]';
  }
  
  return String(value);
};

// Helper function to safely get nested property
export const getSafeProperty = (obj: any, path: string, fallback: string = 'Unknown'): string => {
  if (!obj) return fallback;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return fallback;
    }
    current = current[key];
  }
  
  return toSafeString(current) || fallback;
};

// Main safe render function - this is the one to use in JSX
export const safeRender = (val: any): string => {
  if (val == null) return '';
  
  if (typeof val === 'string') {
    return val;
  }
  
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  
  if (Array.isArray(val)) {
    return val.map(safeRender).join(', ');
  }
  
  if (typeof val === 'object') {
    // Don't stringify React elements
    if (val.$$typeof) return '';
    
    // For objects, try to extract a meaningful string representation
    if (val.name) return String(val.name);
    if (val.email) return String(val.email);
    if (val.id || val._id) return String(val.id || val._id);
    if (val.title) return String(val.title);
    if (val.description) return String(val.description);
    
    // If it's a MongoDB object, return a safe representation
    return '[Object]';
  }
  
  return String(val);
};

// Sanitize arrays of objects (like products, customers, etc.)
export const sanitizeArray = <T extends Record<string, any>>(array: T[]): T[] => {
  return array.map((item) => {
    const sanitized = deepSanitize(item);
    
    // Ensure all properties are safe for rendering
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key];
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = toSafeString(value);
      }
    });
    
    return sanitized as T;
  });
};

// Validate that no objects remain in data
export const validateNoObjects = (data: any, context: string = 'data'): boolean => {
  if (typeof data === 'object' && data !== null) {
    console.error(`🔍 ERROR: Object detected in ${context}:`, data);
    return false;
  }
  return true;
}; 