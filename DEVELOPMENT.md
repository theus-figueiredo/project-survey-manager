# AI and Contributor Instructions

This file is the project-specific source of truth for development workflow, environment notes, command usage, and code conventions.

All contributors and coding agents should read this file before making changes to the project.

When there is any project-specific doubt about how to implement, document, run, or organize code, prefer the rules in this file.

## Purpose

- Document the local environment and execution model.
- Standardize command execution, especially commands that depend on `corepack` and Docker.
- Define code conventions for new files and changes.
- Define the required documentation standard for classes and methods.

## Priority

- Follow this file for project-specific conventions.
- Use it as prior context before creating or editing files.
- If a future global instruction conflicts with this file, prefer the more specific project rule when it is clearly about this repository.

## Ambiente

- Projeto backend em `NestJS` com `TypeORM`.
- Banco de dados local em `PostgreSQL` via `Docker Compose`.
- O projeto usa `corepack` para executar `yarn`.
- A API roda no serviço `eyf-api`.
- O banco roda no serviço `eyf-db`.

## Comandos

### Executando com `corepack`

Sempre prefira executar comandos com `corepack yarn`, principalmente fora do container.

Exemplos:

```bash
corepack yarn build
corepack yarn start:dev
corepack yarn migration:run
```

### Executando dentro do container

Quando o comando depender do ambiente do container ou da rede interna do Docker, execute via `docker compose exec`.

Exemplos:

```bash
docker compose exec eyf-api corepack yarn build
docker compose exec eyf-api corepack yarn migration:run
docker compose exec eyf-api corepack yarn migration:revert
docker compose exec eyf-api corepack yarn migration:generate ./src/database/migrations/NameOfMigration
docker compose exec eyf-api corepack yarn start:dev
```

### Fluxo de migrations

Criar migration vazia:

```bash
docker compose exec eyf-api corepack yarn migration:create ./src/database/migrations/NameOfMigration
```

Gerar migration a partir das entities:

```bash
docker compose exec eyf-api corepack yarn migration:generate ./src/database/migrations/NameOfMigration
```

Executar migrations:

```bash
docker compose exec eyf-api corepack yarn migration:run
```

Reverter a última migration:

```bash
docker compose exec eyf-api corepack yarn migration:revert
```

## Convenções do projeto

### Modelagem e banco

- Propriedades das classes devem ficar em `camelCase`.
- Colunas do banco devem ficar em `snake_case`.
- Entities devem ficar em `src/modules/<module>/entities`.
- Enums relacionados ao módulo devem ficar dentro do próprio módulo.

### Documentação de código

Todas as classes e métodos criados devem ser devidamente documentados com blocos JSDoc.

### Nomenclatura

- Nomes de classes devem sempre começar com letra maiúscula.
- Isso vale para services, controllers, modules, entities, migrations, errors, DTOs e qualquer outra classe criada no projeto.
- Enums também devem seguir nomenclatura iniciando com letra maiúscula.
- Arquivos que declaram classes ou enums também devem começar com letra maiúscula quando representarem diretamente o nome principal exportado.
- Nomes de módulos devem ficar no singular e começar com letra maiúscula.
- Diretórios de módulos também devem seguir essa convenção de singular com inicial maiúscula.

Padrão esperado:

- A classe deve ter um bloco de documentação explicando sua responsabilidade.
- O construtor deve ter documentação própria.
- Métodos públicos devem ter descrição, `@param`, `@returns` e `@throws` quando aplicável.
- A documentação deve ser objetiva, clara e alinhada com o comportamento real do código.

### Exemplo de padrão de documentação

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyRenting } from '../entities/property-renting.entity';
import { Repository } from 'typeorm';
import { CreatePropertyRentingDto } from '../dto/create-property-renting.dto';
import { GetPropertyService } from '../../property/service/get-property.service';
import { BadRequestError } from '../../../shared/errors/BadRequest.error';
import { Generator } from '../../../shared/common/util/id.generator';
import { UserInfo } from '../../auth/types/user-data.type';

/**
 * Service responsible for handling the creation of property renting records.
 */
@Injectable()
export class CreatePropertyRentingService {
    /**
     * CreatePropertyRentingService constructor.
     *
     * @param {Repository<PropertyRenting>} propertyRenting - The repository for the PropertyRenting entity.
     * @param {GetPropertyService} getPropertyService - The service used to fetch property details.
     */
    public constructor(
        @InjectRepository(PropertyRenting)
        protected readonly propertyRenting: Repository<PropertyRenting>,
        protected readonly getPropertyService: GetPropertyService,
    ) {}

    /**
     * Creates a new property renting record.
     *
     * @param {CreatePropertyRentingDto} dto - The data transfer object containing the details for the new property renting record.
     * @param {UserInfo} user - The authenticated user's information, used to associate the renting record.
     *
     * @returns {Promise<PropertyRenting>} A promise that resolves to the newly created PropertyRenting entity.
     *
     * @throws {BadRequestError} Throws an error if the property renting info cannot be created.
     * @throws {NotFoundError} Throws an error if the specified property does not exist (propagated from GetPropertyService).
     */
    public async create(
        dto: CreatePropertyRentingDto,
        user: UserInfo,
    ): Promise<PropertyRenting> {
        await this.getPropertyService.get(dto.property.id);

        const renting: PropertyRenting = this.propertyRenting.create({
            id: Generator.id(user.id, user.email),
            user_id: user.id,
            ...dto,
            rental_agreement_start_date: dto.rental_agreement_start_date
                ? new Date(dto.rental_agreement_start_date)
                : undefined,
        });

        try {
            return await this.propertyRenting.save(renting);
        } catch (error) {
            throw new BadRequestError(
                'error creating renting info',
                error.message,
            );
        }
    }
}
```

## Observações práticas

- O runtime do Nest usa `autoLoadEntities`.
- A configuração de migrations fica separada para a CLI do `TypeORM`.
- Se um comando de migration falhar localmente fora do Docker, prefira executá-lo dentro do container `eyf-api`.
