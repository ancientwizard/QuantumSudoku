
// INI.ts

import { writeFile , readFile } from 'node:fs/promises'

export class INI
{
    private properties: any = {};

    public get as_object(): any { return this.properties }

    public static async parse_file(file: string): Promise<INI>
    {
        return INI.parse(await readFile(file, { encoding: 'utf8' }));
    }

    public static parse(data: string): INI
    {
        const ini = new INI();

        let section = '';

        data.split('\n').forEach(( line: string ) => {
            line = line.trim()

            // Empty line or comment
            if ( line.length === 0 || line[0] === ';' || line[0] === '#' )
                return

            // Section
            if ( line[0] === '[' && line[line.length - 1] === ']' )
            {
                section = line.substring(1, line.length - 1)
                ini.properties[section] = {}
                return
            }

            const parts = line.split('=')

            if ( parts.length === 2 )
                ini.properties[section][parts[0].trim()] = parts[1].trim();
        });

        return ini;
    }
}

// END