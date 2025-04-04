# Uniespaço

O objetivo principal da solução proposta é criar um sistema integrado de gestão de espaços físicos que centralize as reservas, facilite a manutenção e melhore o acompanhamento do uso dos espaços na UESB. Este sistema deverá:
    ● Centralizar o processo de reservas. Unificar a reserva de todos os tipos de espaços (salas de aula, anfiteatros, etc.) em uma única plataforma, tornando o processo mais transparente, acessível e eficiente. 
    ● Facilitar a manutenção. Prover um canal único para que usuários possam reportar problemas, garantindo que as solicitações sejam encaminhadas diretamente ao setor competente e monitoradas até sua resolução. 
    ● Acompanhar o uso dos espaços. Implementar mecanismos para monitorar o uso real dos espaços, permitindo identificar ociosidade, reservas indevidas e problemas na organização, e tomar ações corretivas de forma proativa.

## Pré-requisitos

- **Docker**: Certifique-se de que o Docker está instalado em sua máquina. Você pode baixá-lo e instalá-lo a partir do [site oficial do Docker](https://www.docker.com/get-started).

- **Windows com WSL2**: Se você estiver utilizando Windows, é necessário ter o WSL2 habilitado. Consulte a [documentação oficial do Laravel Sail](https://laravel.com/docs/12.x/sail) para obter instruções detalhadas.

## Configuração Inicial

1. **Clonar o Repositório**

   Clone este repositório para sua máquina local:

   ```bash
   git clone https://github.com/UniEspaco-Gestor-de-espacos/app
   ```

2. **Navegar para o Diretório do Projeto**

   ```bash
   cd app
   ```

3. **Copiar o Arquivo `.env`**

   Crie uma cópia do arquivo de exemplo `.env`:

   ```bash
   cp .env.example .env
   ```

4. **Instalar Dependências do Composer**

   Instale as dependencias do composer
   ```
    composer install
   ```

   Configure um alias para poder utilizar o comando sail sem o caminho todo
    ```
    alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
    ```

   Utilize o Sail para instalar as dependências do Composer:
   ```bash
   ./vendor/bin/sail composer install
   ```

5. **Gerar a Chave da Aplicação**

   ```bash
   sail artisan key:generate
   ```

6. **Executar Migrações e Seeders (Opcional)**

   Se o projeto utilizar banco de dados e houver migrações e seeders configurados, execute:

   ```bash
   sail artisan migrate --seed
   ```

## Inicialização do Ambiente de Desenvolvimento

Para iniciar o ambiente de desenvolvimento, execute:

```bash
sail up
```

Este comando iniciará os containers Docker em modo interativo. Para rodar os containers em segundo plano (modo "detached"), utilize:

```bash
sail up -d
```

Após iniciar os containers, a aplicação estará acessível em `http://localhost`.

## Comandos Úteis

- **Acessar o Container de Aplicação**

  Para acessar o terminal dentro do container da aplicação:

  ```bash
  sail shell
  ```

- **Executar Comandos Artisan**

  Para executar comandos Artisan, prefixe-os com `sail`:

  ```bash
  sail artisan comando
  ```

- **Executar Comandos do Composer**

  Similarmente, para comandos do Composer:

  ```bash
  sail composer comando
  ```

- **Parar os Containers**

  Para parar os containers em execução:

  ```bash
  sail down
  ```

## Considerações Finais

Para mais informações sobre o Laravel Sail e suas funcionalidades, consulte a [documentação oficial](https://laravel.com/docs/12.x/sail).

Se encontrar problemas ou tiver dúvidas durante a configuração ou uso do projeto, sinta-se à vontade para abrir uma issue neste repositório.

---

*Este README foi elaborado para auxiliar na configuração e uso deste projeto Laravel 12 com Sail. Certifique-se de adaptar os comandos e informações conforme as especificidades do seu projeto.* 