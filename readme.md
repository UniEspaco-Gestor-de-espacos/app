# Uniespaço

O objetivo principal da solução proposta é criar um sistema integrado de gestão de espaços físicos que centralize as reservas, facilite a manutenção e melhore o acompanhamento do uso dos espaços na UESB. Este sistema deverá:
● Centralizar o processo de reservas. Unificar a reserva de todos os tipos de espaços (salas de aula, anfiteatros, etc.) em uma única plataforma, tornando o processo mais transparente, acessível e eficiente.
● Facilitar a manutenção. Prover um canal único para que usuários possam reportar problemas, garantindo que as solicitações sejam encaminhadas diretamente ao setor competente e monitoradas até sua resolução.
● Acompanhar o uso dos espaços. Implementar mecanismos para monitorar o uso real dos espaços, permitindo identificar ociosidade, reservas indevidas e problemas na organização, e tomar ações corretivas de forma proativa.

## Pré-requisitos

- **PHP - 8.4**: Certifique-se de que o php esteja instalado em sua maquina, na versão 8.4
- **Composer**: Certifique-se de que o Composer esteja instalado em sua maquina
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

5. **Inicialização do Ambiente de Desenvolvimento**

    Para iniciar o ambiente de desenvolvimento, execute:

    ```bash
    sail up -d
    ```

6. **Gerar a Chave da Aplicação**

    ```bash
    sail artisan key:generate
    ```

7. **Executar Migrações e Seeders**

    OBS.: AGUARDE O SERVIDOR MYSQL INICIAR POR COMPLETO PARA PODER RODAR O COMANDO "MIGRATE" CASO CONTRARIO VAI DAR ERRO.

    ```bash
    sail artisan migrate --seed
    ```

8. **Instalar Dependências do Vite**

    Instale as dependencias do Vite

    ```
     npm install && npm run build
    ```

Após rodar os comandos, a aplicação estará acessível em `http://localhost`.

- **Parar os Containers**

    Para parar os containers em execução:

    ```bash
    sail stop
    ```

- **Observações**
  O Sail deu erros ao inicializar o mysql, pois ele não setou o DB_HOST no mysql no arquivo docker-compose.yml
    ```
    MYSQL_ROOT_HOST: '${DB_HOST}'
    ```
