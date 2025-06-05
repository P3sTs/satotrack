
export interface CodeGenerationParams {
  userName: string;
  userId: string;
}

export class ReferralCodeGenerator {
  private static readonly PREFIX = 'SATO';
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_RETRIES = 50;

  /**
   * Gera um código de referência baseado no nome do usuário
   */
  static generateCode({ userName, userId }: CodeGenerationParams): string {
    console.log('Generating code for:', { userName, userId });
    
    // Limpar e processar o nome
    const cleanName = this.cleanUserName(userName);
    console.log('Clean name:', cleanName);
    
    // Criar prefixo do nome (2-4 caracteres)
    const namePrefix = this.createNamePrefix(cleanName);
    console.log('Name prefix:', namePrefix);
    
    // Criar sufixo único baseado no ID do usuário
    const userSuffix = this.createUserSuffix(userId);
    console.log('User suffix:', userSuffix);
    
    const baseCode = `${this.PREFIX}${namePrefix}${userSuffix}`;
    console.log('Generated base code:', baseCode);
    
    return baseCode;
  }

  /**
   * Gera variações do código em caso de conflito
   */
  static generateVariations(baseCode: string): string[] {
    const variations: string[] = [];
    
    for (let i = 1; i <= this.MAX_RETRIES; i++) {
      const suffix = i.toString().padStart(2, '0');
      variations.push(`${baseCode}${suffix}`);
    }
    
    return variations;
  }

  /**
   * Limpa o nome do usuário removendo acentos e caracteres especiais
   */
  private static cleanUserName(userName: string): string {
    if (!userName || userName.trim().length === 0) {
      return 'USER';
    }

    return userName
      .normalize('NFD') // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiais
      .replace(/\s+/g, '') // Remover espaços
      .toUpperCase()
      .trim();
  }

  /**
   * Cria o prefixo baseado no nome (2-4 caracteres)
   */
  private static createNamePrefix(cleanName: string): string {
    if (cleanName.length === 0) {
      return 'USER';
    }

    // Se o nome for muito curto, usar como está
    if (cleanName.length <= 4) {
      return cleanName.padEnd(this.MIN_NAME_LENGTH, 'X');
    }

    // Tentar usar as primeiras letras das palavras se houver múltiplas
    const words = cleanName.split(/(?=[A-Z])/); // Split em camelCase
    if (words.length > 1) {
      const initials = words
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .substring(0, 4);
      
      if (initials.length >= this.MIN_NAME_LENGTH) {
        return initials;
      }
    }

    // Usar os primeiros 4 caracteres
    return cleanName.substring(0, 4);
  }

  /**
   * Cria sufixo único baseado no ID do usuário
   */
  private static createUserSuffix(userId: string): string {
    // Usar os primeiros e últimos caracteres do UUID para criar um sufixo único
    const cleanId = userId.replace(/-/g, '').toUpperCase();
    const start = cleanId.substring(0, 2);
    const end = cleanId.substring(cleanId.length - 2);
    return start + end;
  }

  /**
   * Valida se o código gerado atende aos critérios
   */
  static validateCode(code: string): boolean {
    const minLength = 8;
    const maxLength = 16;
    const validPattern = /^[A-Z0-9]+$/;
    
    return (
      code.length >= minLength &&
      code.length <= maxLength &&
      validPattern.test(code) &&
      code.startsWith(this.PREFIX)
    );
  }
}
