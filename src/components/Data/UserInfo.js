class UserInfo {
    static myInstance = null;

    nume = "";
    filiala = "";
    codPers = "";
    codDepart = "";
    tipAngajat = "";
    unitLog = "";
    menuItems = [
        { name: 'document', label: 'Documente produse' },
        { name: 'iesire', label: 'Iesire' }
    ]


    static getInstance() {
        if (UserInfo.myInstance == null) {
            UserInfo.myInstance = new UserInfo();
        }

        return this.myInstance;
    }


    getCodPers() {
        return this.codPers;
    }


    setCodPers(id) {
        this.codPers = id;
    }

    getNume() {
        return this.nume;
    }

    setNume(nume) {
        this.nume = nume;
    }


    getFiliala() {
        return this.filiala;
    }

    setFiliala(filiala) {
        this.filiala = filiala;
    }

    getCodDepart() {
        return this.codDepart;
    }

    setCodDepart(codDepart) {
        this.codDepart = codDepart;
    }

    getTipAngajat() {
        return this.tipAngajat;
    }

    setTipAngajat(tipAngajat) {
        this.tipAngajat = tipAngajat;
    }

    getUnitLog() {
        return this.unitLog;
    }

    setUnitLog(unitLog) {
        this.unitLog = unitLog;
    }

    getMenuItems() {


        if (this.tipAngajat === 'ARC' || this.tipAngajat === 'ISI')
            return [
                { name: 'tablete', label: 'Gestiune tablete' },
                { name: 'iesire', label: 'Iesire' }
            ]
        else
            return this.menuItems;
    }
}


export default UserInfo;