import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'core-l', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});