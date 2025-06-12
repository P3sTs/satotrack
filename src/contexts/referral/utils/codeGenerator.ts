
export interface CodeGenerationParams {
  userName: string;
  userId: string;
}

export class ReferralCodeGenerator {
  private static readonly PREFIX = 'SATO';
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_RETRIES = 10;

  /**
   * Gera um código de referência baseado no nome do usuário
   */
  static generateCode({ userName, userId }: CodeGenerationParams): string {
    console.log('Generating code for:', { userName, userId });
    
    // Limpar e processar o nome
    const cleanName = this.cleanUserName(userName);
    console.log('Clean name:', cleanName);
    
    // Criar parte do nome (2-4 caracteres)
    const namePart = this.createNamePart(cleanName);
    console.log('Name part:', namePart);
    
    // Criar sufixo único baseado no ID do usuário (4 caracteres)
    const userSuffix = this.createUserSuffix(userId);
    console.log('User suffix:', userSuffix);
    
    const finalCode = `${this.PREFIX}${namePart}${userSuffix}`;
    console.log('Generated final code:', finalCode);
    
    return finalCode;
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
   * Cria a parte do nome para o código (2-4 caracteres)
   */
  private static createNamePart(cleanName: string): string {
    if (cleanName.length === 0) {
      return 'USER';
    }

    // Se o nome for muito curto, usar como está e preencher
    if (cleanName.length <= 3) {
      return cleanName.padEnd(3, 'X');
    }

    // Usar os primeiros 3 caracteres
    return cleanName.substring(0, 3);
  }

  /**
   * Cria sufixo único baseado no ID do usuário (4 caracteres)
   */
  private static createUserSuffix(userId: string): string {
    // Usar hash simples do UUID para criar sufixo de 4 caracteres
    const cleanId = userId.replace(/-/g, '').toUpperCase();
    
    // Pegar caracteres específicos do UUID para garantir unicidade
    const part1 = cleanId.substring(0, 2);   // Primeiros 2
    const part2 = cleanId.substring(cleanId.length - 2); // Últimos 2
    
    return part1 + part2;
  }

  /**
   * Valida se o código gerado atende aos critérios
   */
  static validateCode(code: string): boolean {
    const minLength = 8;
    const maxLength = 15;
    const validPattern = /^[A-Z0-9]+$/;
    
    return (
      code.length >= minLength &&
      code.length <= maxLength &&
      validPattern.test(code) &&
      code.startsWith(this.PREFIX)
    );
  }
}
