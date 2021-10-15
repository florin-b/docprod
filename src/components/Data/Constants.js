

class Constants {
    static tipDocumenteArticol = [{ cod: '1', nume: 'Declaratie de performanta' }, { cod: '2', nume: 'Declaratie de conformitate' }, { cod: '3', nume: 'Instrucţiuni privind utilizarea produsului' }, { cod: '4', nume: 'Instructiuni de manipulare, transport si depozitare' }, { cod: '5', nume: 'Agrementul tehnic' }, { cod: '6', nume: 'Performantele determinate si verificate de producator' }, { cod: '7', nume: 'Avizul sanitar' }, { cod: '8', nume: 'Fisa de securitate' }, { cod: '9', nume: 'Certificat de conformitate' }];
    static tipDocumenteSinteti = ["Document sintetic 1", "Document sintetic 2", "Document sintetic 3"];

    static hasDocumentExpDate(codDocument) {

        switch (codDocument) {
            case '5':
                return true;
            case '9':
                return true
            default:
                return false;


        }
    }





}

export default Constants;