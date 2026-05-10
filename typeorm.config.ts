import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getTypeOrmBaseOptions } from './src/config/database.config';

export default new DataSource(getTypeOrmBaseOptions());
