import es from 'event-stream';
import fs from 'fs';
import _PareseData from './parsedata';


export default class _ParseToFile extends _PareseData {
    constructor() {
        super();
    }

    splite_file(read_file_path, write_file_path, max_rows_per_file, end_read_at_line, offset:number, token, line_condition?:Function, cb?:Function) {
        var lineNr = 0;
        var current_line_per_file = 0;
        var current_file_count = 0;
        const splitted_files_paths = []
        const read_stream = fs.createReadStream(read_file_path);
        var current_write_stream : fs.WriteStream;
        line_condition = line_condition?line_condition: (line):boolean=>{
            return line && line.match(/,"/g)?.length >= 34;
        }
        const prom = new Promise<string[]>((resolve, reject) => {
            var parestream = read_stream.pipe(es.split())
            .pipe(es.mapSync(function (line) {
                lineNr++;
                current_line_per_file++;
                if (lineNr >= end_read_at_line) {
                        read_stream.emit("end");
                        current_write_stream?.emit("end");
                        console.log("stream ended");
                        return;
                    }
                    if ( current_line_per_file >= max_rows_per_file || (offset+1) == lineNr) {
                        current_line_per_file=0;
                        if (current_file_count>0) {
                            current_write_stream?.emit("end");
                            current_write_stream?.destroy();
                        }
                        let filename = write_file_path+current_file_count;
                        console.log(`Creating file: ${filename}`);
                        splitted_files_paths.push(filename)
                        current_write_stream = fs.createWriteStream(filename);
                        current_file_count++;
                    }
                    if (offset < lineNr && lineNr < end_read_at_line+offset) {
                        if (line_condition(line)) {       
                            current_write_stream.write(line + "\n");
                        }else{
                            console.error(`line number '${lineNr}' is invalid`);
                            console.error(line);
                        }
                    }
                })
                    .on('error', function (err) {
                        console.log('Error while reading file.', err);
                        reject({ error: err, lineNr });

                    })
                    .on('end', function () {
                        console.log('Read file, lines count:' + lineNr);
                        resolve(splitted_files_paths);
                    }))
            token.cancel = function () {  // SPECIFY CANCELLATION
                read_stream.emit("end");
                current_write_stream?.emit("end");
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr); // reject the promise
            }

        });
        return prom;


    }
}