
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarteiras } from '../contexts/CarteirasContext';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { validarEnderecoBitcoin } from '../services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormValues {
  nome: string;
  endereco: string;
}

const NovaCarteira: React.FC = () => {
  const { adicionarCarteira, isLoading } = useCarteiras();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>({
    defaultValues: {
      nome: '',
      endereco: ''
    }
  });
  
  const endereco = watch('endereco');
  const enderecoValido = endereco ? validarEnderecoBitcoin(endereco) : false;
  
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await adicionarCarteira(data.nome, data.endereco);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar carteira');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para o Dashboard
      </Link>
      
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Adicionar Nova Carteira</CardTitle>
            <CardDescription className="text-sm">
              Insira os detalhes da carteira Bitcoin que você deseja monitorar
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Carteira</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Carteira Principal"
                  {...register('nome', { 
                    required: 'O nome da carteira é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'O nome deve ter pelo menos 3 caracteres'
                    }
                  })}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Bitcoin</Label>
                <Input
                  id="endereco"
                  placeholder="Ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  className="font-mono text-sm"
                  {...register('endereco', { 
                    required: 'O endereço Bitcoin é obrigatório',
                    validate: {
                      valido: (value) => 
                        validarEnderecoBitcoin(value) || 'Endereço Bitcoin inválido'
                    }
                  })}
                />
                
                <div className="flex items-center">
                  {endereco && (
                    enderecoValido ? (
                      <p className="text-xs md:text-sm text-green-500 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Endereço válido
                      </p>
                    ) : (
                      <p className="text-xs md:text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Endereço inválido
                      </p>
                    )
                  )}
                </div>
                
                {errors.endereco && (
                  <p className="text-xs md:text-sm text-red-500">{errors.endereco.message}</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Carteira'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NovaCarteira;
