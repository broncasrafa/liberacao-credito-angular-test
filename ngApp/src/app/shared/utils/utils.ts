export abstract class Util {


  public static getDataFormatada(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }
    //var pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    //var arrayDate = dadosSolicitacao.dataPrimeiroVencimento.match(pattern);
    //var dt = new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1]);

    const pattern = /(\d{2})\/(\d{2})\/(\d{4})/; // DD/MM/YYYY
    const dt = new Date(data.replace(pattern,'$3-$2-$1'));
    const str = dt.toISOString();
    return str.substr(0, 10); // yyyy-mm-dd
  }

}
