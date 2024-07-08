import { Connection } from 'postgresql-client';

export default async function connectAndExecute(funcsWithParams: { func: (...params: any[]) => Promise<any>, params: any[] }[]): Promise<any[]> {
        const connection = new Connection();

        try {
            await connection.connect();

            const results: any[] = [];

            for (const { func, params } of funcsWithParams) {
                const result = await func(...params, connection);
                results.push(result);
            }

            return results;
        } finally {
            await connection.close();
        }
    }