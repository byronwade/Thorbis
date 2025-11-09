/**
 * File Validation and Security
 * 
 * Comprehensive file validation with:
 * - Extension blocklist (dangerous file types)
 * - Magic number/signature verification
 * - Size limits by context
 * - MIME type validation
 * - Filename sanitization
 * - Content inspection
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Blocked file extensions - Executable and potentially dangerous files
 * These can never be uploaded regardless of context
 */
export const BLOCKED_EXTENSIONS = [
  // Windows executables
  '.exe', '.bat', '.cmd', '.com', '.scr', '.pif',
  '.application', '.gadget', '.msi', '.msp', '.msc',
  '.vbs', '.vbe', '.js', '.jse', '.ws', '.wsf', '.wsc', '.wsh',
  '.ps1', '.ps1xml', '.ps2', '.ps2xml', '.psc1', '.psc2',
  '.msh', '.msh1', '.msh2', '.mshxml', '.msh1xml', '.msh2xml',
  
  // MacOS executables
  '.app', '.dmg', '.pkg', '.mpkg', '.command',
  
  // Linux executables
  '.sh', '.bash', '.zsh', '.fish', '.ksh', '.csh',
  '.run', '.bin', '.deb', '.rpm', '.snap',
  
  // Archives that can contain executables
  '.jar', '.war', '.ear',
  
  // System files
  '.dll', '.sys', '.drv',
  
  // Scripts and code that could be auto-executed
  '.cpl', '.inf', '.ins', '.isp', '.lnk', '.mde',
  '.mdt', '.mdw', '.mdz', '.ops', '.pcd', '.prg',
  '.reg', '.scf', '.sct', '.shb', '.shs', '.url',
  
  // Database files that could contain macros
  '.ade', '.adp', '.mdb', '.accdb',
  
  // Potentially dangerous compressed files
  '.ace', '.arj', '.cab',
];

/**
 * File size limits by context (in bytes)
 */
export const SIZE_LIMITS = {
  avatar: 5 * 1024 * 1024,        // 5MB
  image: 20 * 1024 * 1024,        // 20MB
  document: 100 * 1024 * 1024,    // 100MB
  video: 250 * 1024 * 1024,       // 250MB
  general: 250 * 1024 * 1024,     // 250MB
  invoice: 20 * 1024 * 1024,      // 20MB
  estimate: 20 * 1024 * 1024,     // 20MB
  contract: 50 * 1024 * 1024,     // 50MB
} as const;

/**
 * Allowed MIME types by category
 */
export const ALLOWED_MIME_TYPES = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/heic',
    'image/heif',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'text/plain',
    'text/csv',
    'application/rtf',
  ],
  video: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'video/x-matroska',
  ],
  audio: [
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/flac',
  ],
  archive: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
  ],
  cad: [
    'application/acad',
    'application/x-acad',
    'application/autocad_dwg',
    'image/vnd.dwg',
    'image/vnd.dxf',
  ],
} as const;

/**
 * File magic numbers (signatures) for validation
 * First few bytes of common file types
 */
const FILE_SIGNATURES: Record<string, { bytes: number[]; offset: number }[]> = {
  'image/jpeg': [{ bytes: [0xFF, 0xD8, 0xFF], offset: 0 }],
  'image/png': [{ bytes: [0x89, 0x50, 0x4E, 0x47], offset: 0 }],
  'image/gif': [{ bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 }],
  'image/webp': [{ bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }],
  'application/pdf': [{ bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 }],
  'application/zip': [{ bytes: [0x50, 0x4B, 0x03, 0x04], offset: 0 }],
  'video/mp4': [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
};

// ============================================================================
// TYPES
// ============================================================================

export type FileContext = keyof typeof SIZE_LIMITS;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    sanitizedName: string;
    detectedMimeType?: string;
    category?: string;
  };
}

export interface ValidationOptions {
  context?: FileContext;
  maxSize?: number;
  allowedMimeTypes?: string[];
  checkMagicNumbers?: boolean;
  strictMode?: boolean;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate a file for upload
 * 
 * @param file - The file to validate
 * @param options - Validation options
 * @returns Validation result with errors and metadata
 */
export async function validateFile(
  file: File,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const {
    context = 'general',
    maxSize,
    allowedMimeTypes,
    checkMagicNumbers = true,
    strictMode = false,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Basic file checks
  if (!file || !(file instanceof File)) {
    errors.push('Invalid file object');
    return { valid: false, errors, warnings };
  }

  if (!file.name || file.name.trim() === '') {
    errors.push('File must have a name');
    return { valid: false, errors, warnings };
  }

  // 2. Sanitize filename
  const sanitizedName = sanitizeFileName(file.name);
  if (sanitizedName !== file.name) {
    warnings.push('Filename was sanitized for security');
  }

  // 3. Check for blocked extensions
  const extension = getFileExtension(file.name).toLowerCase();
  if (isBlockedExtension(extension)) {
    errors.push(`File type "${extension}" is not allowed for security reasons`);
    return { valid: false, errors, warnings };
  }

  // 4. Check file size
  const sizeLimit = maxSize ?? SIZE_LIMITS[context];
  if (file.size > sizeLimit) {
    errors.push(
      `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(sizeLimit)})`
    );
  }

  if (file.size === 0) {
    errors.push('File is empty');
  }

  // 5. Check MIME type
  if (allowedMimeTypes && allowedMimeTypes.length > 0) {
    if (!allowedMimeTypes.includes(file.type)) {
      errors.push(
        `File type "${file.type}" is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
      );
    }
  }

  // Detect file category
  const category = detectFileCategory(file.type);

  // 6. Verify magic numbers (file signature)
  let detectedMimeType: string | undefined;
  if (checkMagicNumbers && file.size > 0) {
    try {
      detectedMimeType = (await verifyFileSignature(file)) ?? undefined;
      
      if (detectedMimeType && detectedMimeType !== file.type) {
        if (strictMode) {
          errors.push(
            `File signature mismatch. Claimed: "${file.type}", Detected: "${detectedMimeType}"`
          );
        } else {
          warnings.push(
            `File type mismatch detected. Using detected type: ${detectedMimeType}`
          );
        }
      }
    } catch (error) {
      warnings.push('Could not verify file signature');
    }
  }

  // 7. Additional security checks
  const securityChecks = performSecurityChecks(file, sanitizedName);
  errors.push(...securityChecks.errors);
  warnings.push(...securityChecks.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      sanitizedName,
      detectedMimeType,
      category,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if extension is blocked
 */
export function isBlockedExtension(extension: string): boolean {
  const ext = extension.toLowerCase();
  return BLOCKED_EXTENSIONS.includes(ext);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return '';
  }
  return filename.substring(lastDot);
}

/**
 * Sanitize filename for security
 * - Remove or replace dangerous characters
 * - Prevent path traversal
 * - Limit length
 */
export function sanitizeFileName(fileName: string): string {
  // Get extension first
  const extension = getFileExtension(fileName);
  const nameWithoutExt = fileName.substring(0, fileName.length - extension.length);

  // Remove path traversal attempts
  let sanitized = nameWithoutExt.replace(/\.\./g, '');
  
  // Remove or replace dangerous characters
  sanitized = sanitized
    .replace(/[<>:"|?*]/g, '') // Windows invalid chars
    .replace(/[\x00-\x1F\x80-\x9F]/g, '') // Control characters
    .replace(/^\.+/, '') // Leading dots
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Trim hyphens

  // Limit length (max 200 chars for name, excluding extension)
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  // Ensure we have a name
  if (!sanitized) {
    sanitized = `file-${Date.now()}`;
  }

  return sanitized + extension.toLowerCase();
}

/**
 * Verify file signature (magic numbers)
 */
async function verifyFileSignature(file: File): Promise<string | null> {
  // Read first 8KB of file
  const chunk = file.slice(0, 8192);
  const buffer = await chunk.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check against known signatures
  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const sig of signatures) {
      const matches = sig.bytes.every(
        (byte, index) => bytes[sig.offset + index] === byte
      );
      if (matches) {
        return mimeType;
      }
    }
  }

  return null;
}

/**
 * Detect file category from MIME type
 */
function detectFileCategory(mimeType: string): string | undefined {
  for (const [category, types] of Object.entries(ALLOWED_MIME_TYPES)) {
    if ((types as readonly string[]).includes(mimeType)) {
      return category;
    }
  }
  
  // Fallback to general category detection
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/')) return 'document';
  
  return undefined;
}

/**
 * Perform additional security checks
 */
function performSecurityChecks(
  file: File,
  sanitizedName: string
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for double extensions (e.g., file.pdf.exe)
  const parts = sanitizedName.split('.');
  if (parts.length > 2) {
    const secondExt = '.' + parts[parts.length - 2];
    if (isBlockedExtension(secondExt)) {
      errors.push(
        'File has suspicious double extension that could hide malicious content'
      );
    }
  }

  // Check for very long filenames (potential buffer overflow)
  if (sanitizedName.length > 255) {
    errors.push('Filename is too long');
  }

  // Check for null bytes (can cause issues in some systems)
  if (file.name.includes('\0')) {
    errors.push('Filename contains null bytes');
  }

  // Warn about unusual MIME types
  if (!file.type || file.type === 'application/octet-stream') {
    warnings.push(
      'File type could not be determined. Upload may be rejected.'
    );
  }

  return { errors, warnings };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================================================
// SPECIFIC VALIDATORS
// ============================================================================

/**
 * Validate image file
 */
export async function validateImage(
  file: File,
  maxSize = SIZE_LIMITS.image
): Promise<ValidationResult> {
  return validateFile(file, {
    context: 'image',
    maxSize,
    allowedMimeTypes: [...ALLOWED_MIME_TYPES.image],
    checkMagicNumbers: true,
    strictMode: true,
  });
}

/**
 * Validate document file
 */
export async function validateDocument(
  file: File,
  maxSize = SIZE_LIMITS.document
): Promise<ValidationResult> {
  return validateFile(file, {
    context: 'document',
    maxSize,
    allowedMimeTypes: [...ALLOWED_MIME_TYPES.document],
    checkMagicNumbers: true,
  });
}

/**
 * Validate video file
 */
export async function validateVideo(
  file: File,
  maxSize = SIZE_LIMITS.video
): Promise<ValidationResult> {
  return validateFile(file, {
    context: 'video',
    maxSize,
    allowedMimeTypes: [...ALLOWED_MIME_TYPES.video],
    checkMagicNumbers: false, // Video signatures are complex
  });
}

/**
 * Validate avatar image
 */
export async function validateAvatar(file: File): Promise<ValidationResult> {
  const result = await validateImage(file, SIZE_LIMITS.avatar);
  
  // Additional avatar-specific validation
  if (result.valid && file.type === 'image/svg+xml') {
    result.warnings.push(
      'SVG avatars may be sanitized to remove potential scripts'
    );
  }
  
  return result;
}

/**
 * Batch validate multiple files
 */
export async function validateFiles(
  files: File[],
  options: ValidationOptions = {}
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();
  
  const validations = files.map(async (file) => {
    const result = await validateFile(file, options);
    results.set(file.name, result);
  });
  
  await Promise.all(validations);
  
  return results;
}

/**
 * Check if file passes validation
 */
export async function isValidFile(
  file: File,
  options: ValidationOptions = {}
): Promise<boolean> {
  const result = await validateFile(file, options);
  return result.valid;
}

/**
 * Get validation errors as string
 */
export function getValidationErrorMessage(result: ValidationResult): string {
  if (result.valid) {
    return '';
  }
  
  return result.errors.join('; ');
}

