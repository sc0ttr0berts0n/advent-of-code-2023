import path from 'path';
import fs from 'fs';
import sanitize from 'sanitize-filename';

interface InputParserOptions {
    filename: string;
    url: string;
    day: number;
    separator: string;
    path: string;
    noCache?: boolean;
}

const DEFAULTS = {
    path: 'src/inputs',
    fileExtension: 'txt',
    relCachePath: '../../.cache',
    SESSION_COOKIE:
        'session=53616c7465645f5f779a427d3f6e7630bf12f16f2e6cafbe3272f8949c99717011eb62a46dc944accf6bb9d6402825e00907fd790b2e65911940cf55541b07eb; ',
};

export default class InputParser {
    private _options: Partial<InputParserOptions>;
    private _separator: string[];
    private _filename: string | null = null;
    private path: string;
    public file: string | null;
    private absPathToCache: string;

    constructor(opts?: Partial<InputParserOptions>) {
        this._options = opts ?? {};
        this._filename = opts?.filename
            ? path.basename(opts.filename)
            : this._filename;
        this.path = opts?.path ?? path.resolve(DEFAULTS.path);
        if (opts?.filename) {
            const filepath = path.join(
                this.path,
                `${this._filename}.${DEFAULTS.fileExtension}`
            );
            this.loadFile(filepath);
        }
        this._setupCache();
    }

    static async create(
        opts?: Partial<InputParserOptions>
    ): Promise<InputParser> {
        const ip = new InputParser(opts);

        if (opts?.url) {
            const file = await InputParser._fetch(opts.url);
            ip.file = file;
        }

        if (opts?.day) {
            const url = `https://adventofcode.com/2023/day/${opts.day}/input`;
            const file = await InputParser._fetch(url);
            ip.file = file;
        }

        return ip;
    }

    toArray(): string[] {
        if (!this.file) throw Error('No File.');

        // convert to \n if \r\n
        const file = this.file.replace(/\r\n/g, '\n');

        const lines = file.split('\n');

        // pop of an empty element at the end.
        if (lines.at(-1) === '') {
            lines.pop();
        }

        return lines;
    }

    toRaw(): string {
        if (!this.file) throw Error('No File.');

        return this.file;
    }

    private _setupCache() {
        this.absPathToCache = path.resolve(__dirname, DEFAULTS.relCachePath);
        if (!fs.existsSync(this.absPathToCache)) {
            fs.mkdirSync(this.absPathToCache, { recursive: true });
        }
    }

    private static async _fetch(url: string) {
        // cache check data
        const filename = sanitize(url);
        const cacheFile = path.resolve(
            __dirname,
            DEFAULTS.relCachePath,
            filename
        );

        // if there is a cache, leave early
        if (fs.existsSync(cacheFile)) {
            return fs.readFileSync(cacheFile).toString();
        }

        // otherwise, hit the server
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Cookie: DEFAULTS.SESSION_COOKIE,
            },
        });
        if (res.status !== 200) throw Error(`Bad status: ${res.status}`);

        // buffer to text
        const text = await res.text();

        // write to cache
        fs.writeFileSync(
            path.resolve(__dirname, DEFAULTS.relCachePath, filename),
            text
        );

        // return the text
        return text;
    }

    private loadFile(path: string) {
        this.file = fs.readFileSync(path)?.toString();
    }
}
