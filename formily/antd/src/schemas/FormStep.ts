import { ISchema } from '@formily/react'

export const FormStep: ISchema & { StepPane?: ISchema } = {
  type: 'object',
  properties: {
    direction: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'horizontal',
      },
    },
    size: {
      type: 'string',
      enum: ['default', 'small'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'default',
      },
    },
  },
}

FormStep.StepPane = {
  type: 'object',
  properties: {
    tab: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}
