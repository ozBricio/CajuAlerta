import { z } from 'zod';
import { fileTypeFromBuffer } from 'file-type';

// Schema estrito para cadastro / atualização de perfil (Prevenção contra Mass Assignment)
export const perfilUpdateSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(100),
  telefone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Telefone inválido").optional(),
}).strict();

// Schema estrito para denúncias
export const denunciaSchema = z.object({
  alvo: z.string().min(3, "Alvo inválido"),
  motivo: z.string().min(5, "Motivo muito curto").max(500),
  tipo: z.enum(['email', 'telefone', 'site']),
}).strict();

// Validador de upload seguro (Prevenção contra injeção de arquivos maliciosos / Magic Numbers)
export async function validarUploadSeguro(fileBuffer) {
  try {
    const detectedType = await fileTypeFromBuffer(fileBuffer);
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
      return { valido: false, erro: 'Formato de arquivo inválido ou não suportado. Apenas JPEG, PNG e WebP.' };
    }

    return { valido: true, mime: detectedType.mime, ext: detectedType.ext };
  } catch (error) {
    return { valido: false, erro: 'Erro ao analisar a integridade do arquivo.' };
  }
}
