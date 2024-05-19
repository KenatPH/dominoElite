
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveImage = (OldImageName:String = '', base64Data:String) => {
    return new Promise((res, rej) => {
        let filename:String
        if (base64Data) {
            filename = uuidv4() + '.jpg'
            let path = 'src/public/images/' + filename
            try {
                let imageData = base64Data;
                let base64Data1 = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                fs.writeFileSync(path, base64Data1, { encoding: 'base64' });
                let response = { "error": false, "message": "Save image", "image": path }
                console.log('respuesta imagenes', response);
                res(filename)
            } catch (e) {
                console.log(e);
            }

            try {
                if (OldImageName && OldImageName.length > 0) {
                    fs.unlinkSync('src/public/images/' + OldImageName);
                    console.log('Archivo eliminado');
                } else {
                    console.log("sin imagen: ", OldImageName);
                }
            } catch (err) {
                console.error('Ocurrió un error al eliminar el archivo', err);
            }


        } else {
            res('')
        }
    })
}
