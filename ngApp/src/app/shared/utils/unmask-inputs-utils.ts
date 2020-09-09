export abstract class UnMaskInputUtil {

  public static removeMaskCpf(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }

    return data.replace('.', '').replace('.', '').replace('-', '').trim();
  }

  public static removeMaskCnpj(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }

    return data.replace('.', '').replace('.', '').replace('/', '').replace('-', '').trim();
  }

  public static removeMaskCelular(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }

    return data.replace('(', '').replace(')', '').replace('-', '').replace(/ /g,'').trim();
  }

  public static removeMaskTelefoneFixo(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }

    return data.replace('(', '').replace(')', '').replace('-', '').replace(/ /g,'').trim();
  }

  public static removeMaskCep(data: string): string {
    if(data === undefined || (data == null)) {
      return null;
    }

    if(data.trim().length === 0) {
      return null;
    }

    return data.replace('.', '').replace('-', '').trim();
  }
}
