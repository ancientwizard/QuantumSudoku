
// INI.ts

import { writeFile, readFile, unlink            } from 'node:fs/promises'
import { toISOStringWithoutFractionalSeconds    } from '@/js/util/iso-8601';

export class INI
{
    public filename = 'config.ini';
    private properties: { [key: string]: { [key: string]: string } } = {};

    public get as_object(): { [key: string]: { [key: string]: string } } { return this.properties }

    public static async parse_file(file: string): Promise<INI>
    {
        const ini = INI.parse(await readFile(file, { encoding: 'utf8' }));
        ini.filename = file
        return ini
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

    public param(section: string, key: string, prop: (string|null) = null): string
    {
        if ( prop !== null )
            this.properties[section][key] = prop;
        return this.properties[section][key];
    }

    public async save(file: string): Promise<void>
    {
        await writeFile(file, this.toString(), { encoding: 'utf8' });
    }

    public toString(): string
    {
        let result = ''
        result += `# ${this.filename}\n`
        result += `# version 0.1\n`
        result += `# ${toISOStringWithoutFractionalSeconds(new Date())}\n\n`
        
        for ( const section in this.properties )
        {
            result += `[${section}]\n`;

            for ( const key in this.properties[section] )
                result += `${key}=${this.properties[section][key]}\n`;

            result += '\n';
        }

        result += '## END\n';

        return result;
    }

    // unink INI file
    public async unlink(): Promise<void>
    {
        return await unlink(this.filename)
    }
}

// END