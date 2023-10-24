// public - available for frontend
export const REGION = process.env['NEXT_PUBLIC_REGION'];
export const STAGE = process.env['NEXT_PUBLIC_STAGE'] || '';
export const COGNITO_CLIENT_ID = process.env['NEXT_PUBLIC_COGNITO_CLIENT_ID'];
export const COGNITO_USER_POOL_ID = process.env['NEXT_PUBLIC_COGNITO_USER_POOL_ID'];
export const COGNITO_DOMAIN_NAME = process.env['NEXT_PUBLIC_COGNITO_DOMAIN_NAME'];
export const GRAPHQL_ENDPOINT = process.env['NEXT_PUBLIC_GRAPHQL_ENDPOINT'] || 'http://localhost:3000/graphql';
export const REST_ENDPOINT = process.env['NEXT_PUBLIC_REST_API_URL'] || 'http://localhost:3000';
export const WEBSOCKET_ENDPOINT = process.env['NEXT_PUBLIC_WEBSOCKET_API_URL'] || 'ws://localhost:3001';

// not public - backend-only
export const NEXTAUTH_URL = process.env['NEXTAUTH_URL'] || 'http://localhost:3000';
export const NEXTAUTH_SECRET = process.env['NEXTAUTH_SECRET'] || 'like_tears_in_the_rain';
export const TOGGLED_FEATURE_FLAGS_CLIENT_KEY = process.env['TOGGLED_FEATURE_FLAGS_CLIENT_KEY'] || 'secret';
