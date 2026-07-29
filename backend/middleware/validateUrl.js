import { AppError } from './errorHandler.js';

// SSRF protection: block private/internal IPs
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS metadata endpoint
];

// Private IP ranges (CIDR notation patterns)
const PRIVATE_IP_PATTERNS = [
  /^10\./,                    // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./,              // 192.168.0.0/16
  /^127\./,                   // 127.0.0.0/8 (loopback)
  /^169\.254\./,              // 169.254.0.0/16 (link-local)
  /^::1$/,                    // IPv6 loopback
  /^fe80:/,                   // IPv6 link-local
  /^fc00:/,                   // IPv6 unique local
];

export const validateUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    throw new AppError('URL is required', 400, 'INVALID_URL');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw new AppError('Invalid URL format', 400, 'INVALID_URL');
  }

  // Only allow HTTP/HTTPS protocols
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new AppError('Only HTTP and HTTPS protocols are allowed', 400, 'INVALID_URL');
  }

  // Check blocked hosts
  const hostname = parsedUrl.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    throw new AppError('Invalid or disallowed URL', 400, 'INVALID_URL');
  }

  // Check private IP patterns
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      throw new AppError('Invalid or disallowed URL', 400, 'INVALID_URL');
    }
  }

  // Attach normalized URL to request
  req.normalizedUrl = parsedUrl.href;
  next();
};
