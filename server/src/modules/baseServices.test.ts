import { Model, Schema, model } from 'mongoose';
import BaseServices from './baseServices';
import httpStatus from 'http-status';
import CustomError from '../errors/customError';

// Create a minimal schema and model for testing
const TestSchema = new Schema({}, { collection: 'test' });
const TestModel = model('TestModel', TestSchema);

// Mock model methods to simulate database interactions
const mockModel = TestModel;
mockModel.create = jest.fn().mockResolvedValue({});
mockModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
mockModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

describe('BaseServices', () => {
    const modelName = 'TestModel';
    let baseServices: BaseServices<any>;

    beforeEach(() => {
        baseServices = new BaseServices(mockModel as any, modelName);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should throw an error if model is invalid', () => {
            expect(() => new BaseServices(null as any, modelName)).toThrow('Invalid Mongoose model!');
        });
    });

    describe('create', () => {
        it('should add userId to payload and call model.create', async () => {
            const payload = { name: 'test', user: 'someOtherId' };
            const userId = 'user123';
            const modifiedPayload = { ...payload, user: userId };
            mockModel.create.mockResolvedValue(modifiedPayload);

            const result = await baseServices.create(payload, userId);

            expect(payload.user).toBe(userId);
            expect(mockModel.create).toHaveBeenCalledWith(modifiedPayload);
            expect(result).toEqual(modifiedPayload);
        });
    });

    describe('update', () => {
        it('should call _isExists and model.findByIdAndUpdate', async () => {
            const id = 'validId';
            const payload = { name: 'updated' };
            const mockUpdate = jest.fn().mockResolvedValue({ _id: id, ...payload });
            (baseServices as any).model.findByIdAndUpdate = mockUpdate;
            // We need to mock protected method _isExists, we can do this by using any because of jest
            (baseServices as any)['_isExists'] = jest.fn().mockResolvedValue(undefined);

            const result = await baseServices.update(id, payload);

            expect(baseServices['_isExists']).toHaveBeenCalledWith(id);
            expect(mockUpdate).toHaveBeenCalledWith(id, payload, { new: true, runValidators: true });
            expect(result).toEqual({ _id: id, ...payload });
        });

        it('should throw error if document not found', async () => {
            const id = 'invalidId';
            const payload = { name: 'updated' };

            // Simulate document not found for _isExists
            (baseServices as any)['_isExists'] = jest.fn().mockRejectedValue(
                new CustomError(httpStatus.NOT_FOUND, modelName + ' is not found!')
            );

            await expect(baseServices.update(id, payload)).rejects.toThrow(modelName + ' is not found!');
            expect(baseServices['_isExists']).toHaveBeenCalledWith(id);
        });
    });

    describe('delete', () => {
        it('should call _isExists and model.findByIdAndDelete', async () => {
            const id = 'validId';
            const mockDelete = jest.fn().mockResolvedValue({ _id: id });
            (baseServices as any).model.findByIdAndDelete = mockDelete;
            (baseServices as any)['_isExists'] = jest.fn().mockResolvedValue(undefined);

            const result = await baseServices.delete(id);

            expect(baseServices['_isExists']).toHaveBeenCalledWith(id);
            expect(mockDelete).toHaveBeenCalledWith(id);
            expect(result).toEqual({ _id: id });
        });

        it('should throw error if document not found', async () => {
            const id = 'invalidId';

            // Simulate document not found for _isExists
            (baseServices as any)['_isExists'] = jest.fn().mockRejectedValue(
                new CustomError(httpStatus.NOT_FOUND, modelName + ' is not found!')
            );

            await expect(baseServices.delete(id)).rejects.toThrow(modelName + ' is not found!');
            expect(baseServices['_isExists']).toHaveBeenCalledWith(id);
        });
    });

    describe('_isExists', () => {
        it('should resolve if document exists', async () => {
            const id = 'validId';
            mockModel.findById = jest.fn().mockResolvedValue({ _id: id });
            baseServices = new BaseServices(mockModel, modelName);

            await expect(baseServices['_isExists'](id)).resolves.toBeUndefined();
            expect(mockModel.findById).toHaveBeenCalledWith(id);
        });

        it('should reject with CustomError if document does not exist', async () => {
            const id = 'invalidId';
            mockModel.findById = jest.fn().mockResolvedValue(null);
            baseServices = new BaseServices(mockModel, modelName);

            await expect(baseServices['_isExists'](id)).rejects.toThrow(modelName + ' is not found!');
            expect(mockModel.findById).toHaveBeenCalledWith(id);
        });
    });
});
