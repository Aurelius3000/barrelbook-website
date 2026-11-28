import { authorizeWebOwner } from '../../../lib/web-admission';

export const runtime = 'nodejs';
export const POST = authorizeWebOwner;
