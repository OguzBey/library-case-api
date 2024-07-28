import { ClassValidatorDTO } from '@shared/class-validator';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

function getTransformedInstance(data: Record<string, any>, dataType: 'body' | 'qs' | 'params', Validator: typeof ClassValidatorDTO) {
  let classTransformOptions: ClassTransformOptions = {
    enableImplicitConversion: false,
    exposeDefaultValues: true,
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  };
  if (dataType == 'qs' || dataType == 'params') classTransformOptions.enableImplicitConversion = true;
  let tInstance = plainToInstance(Validator, data, classTransformOptions);
  return tInstance;
}

export const validateData = function (validateList: { validateClass: typeof ClassValidatorDTO; dataType: 'body' | 'qs' | 'params' }[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const orginalFunc = descriptor.value!;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      for (const vItem of validateList) {
        let reqData = vItem.dataType == 'body' ? req.body : vItem.dataType == 'qs' ? req.query : req.params;
        let tInstance = getTransformedInstance(reqData, vItem.dataType, vItem.validateClass);
        let errors = tInstance.checkErrors();
        if (errors.length > 0) return next(errors);

        let tPlain = { ...tInstance };

        if (vItem.dataType == 'body') req.body = tPlain;
        else if (vItem.dataType == 'qs') req.query = tPlain;
        else req.params = tPlain;
      }
      return orginalFunc.apply(this, arguments);
    };
  };
};
