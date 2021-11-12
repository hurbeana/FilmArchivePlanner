import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConfigService } from './database-config.service';

describe('DatabaseConfigService', () => {
  let service: DatabaseConfigService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be a TypeOrmOptionsFactory', () => {
    expect(service.createTypeOrmOptions).toBeDefined();
  });

  describe('createTypeOrmOptions', () => {
    const backendConfigDev = 'development';
    const backendConfigTesting = 'testing';
    const backendConfigProd = 'production';
    const devMode = {
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true,
    };
    const prodMode = {
      autoLoadEntities: false,
      synchronize: false,
      keepConnectionAlive: false,
    };
    const testConfig = {
      connectionName: 'test',
      type: 'postgres',
      host: 'localhost',
      port: 1234,
      username: 'test',
      password: 'test',
      database: 'test',
    };

    it('should read from config service twice', () => {
      const mock = jest.spyOn(config, 'get');
      service.createTypeOrmOptions();
      expect(mock).toHaveBeenCalledTimes(2);
    });

    it('should read a value supplied from db config', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValue(testConfig);
      expect(service.createTypeOrmOptions()).toHaveProperty('type', 'postgres');
    });

    it('should not contain values not supplied from db config', () => {
      expect(service.createTypeOrmOptions()).not.toHaveProperty(
        'type',
        testConfig.type,
      );
    });

    it('should read a value supplied from db config', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValue(testConfig);
      expect(service.createTypeOrmOptions()).toHaveProperty(
        'type',
        testConfig.type,
      );
    });

    it('should read all values supplied from db config', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValue(testConfig);
      expect(service.createTypeOrmOptions()).toMatchObject(testConfig);
    });

    it('should set specific values based on backend config (dev mode)', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValue(backendConfigDev);
      expect(service.createTypeOrmOptions()).toMatchObject(devMode);
    });

    it('should set specific values based on backend config (prod mode)', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValue(backendConfigProd);
      expect(service.createTypeOrmOptions()).toMatchObject(prodMode);
    });

    it('should combine backend env and db config', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValueOnce(backendConfigDev);
      mock.mockReturnValueOnce(testConfig);
      expect(service.createTypeOrmOptions()).toEqual({
        ...devMode,
        ...testConfig,
      });
    });

    it('should set the db name to POSTGRES_DB when in testing env', () => {
      const mock = jest.spyOn(config, 'get');
      mock.mockReturnValueOnce(backendConfigTesting);
      mock.mockReturnValueOnce(testConfig);
      mock.mockReturnValueOnce('dbtesting');
      expect(service.createTypeOrmOptions()).toEqual({
        ...devMode,
        ...testConfig,
        database: 'dbtesting',
      });
    });
  });
});
