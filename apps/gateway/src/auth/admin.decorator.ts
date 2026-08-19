import { SetMetadata } from "@nestjs/common";



export const REQUIRED_ROLE_KEY = 'requiredrole';

export const AdminOnly = () => SetMetadata(REQUIRED_ROLE_KEY,'admin')