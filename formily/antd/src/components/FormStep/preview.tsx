import React, { Fragment, useState } from 'react'
import { observer } from '@formily/react'
import { Steps } from 'antd'
import type { StepProps, StepsProps } from 'antd/lib/steps'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import {
  useNodeIdProps,
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  DnFC,
} from '@designable/react'
import { LoadTemplate } from '../../common/LoadTemplate'
import { useDropTemplate } from '../../hooks'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { matchComponent } from '../../shared'

const parseSteps = (parent: TreeNode) => {
  const steps: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormStep.StepPane')) {
      steps.push(node)
    }
  })
  return steps
}

// const getCorrectActiveKey = (activeKey: string, tabs: TreeNode[]) => {
//   if (tabs.length === 0) return
//   if (tabs.some((node) => node.id === activeKey)) return activeKey
//   return tabs[tabs.length - 1].id
// }

export const FormStep: DnFC<StepsProps> & {
  StepPane?: React.FC<StepProps>
} = observer((props) => {
  const [current, setCurrent] = useState(0)
  const nodeId = useNodeIdProps()
  const node = useTreeNode()
  const designer = useDropTemplate('FormStep', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: 'Unnamed Title',
          },
        },
        children: source,
      }),
    ]
  })
  const steps = parseSteps(node)
  const renderTabs = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <>
        <Steps
          {...props}
          current={current}
          onChange={(id) => {
            setCurrent(id)
          }}
        >
          {steps.map((step) => {
            const props = step.props['x-component-props'] || {}
            return (
              <Steps.Step
                {...props}
                style={{ ...props.style }}
                key={step.id}
              ></Steps.Step>
            )
          })}
        </Steps>
        {steps.map((item, index) => {
          return (
            index === current &&
            React.createElement(
              'div',
              {
                [designer.props.nodeIdAttrName]: item.id,
                style: {
                  padding: '20px 0',
                },
              },
              item.children.length ? (
                <TreeNodeWidget node={item} />
              ) : (
                <DroppableWidget node={item} />
              )
            )
          )
        })}
      </>
    )
  }
  return (
    <div {...nodeId}>
      {renderTabs()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addStep'),
            icon: 'AddPanel',
            onClick: () => {
              const stepPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormStep.StepPane',
                  'x-component-props': {
                    title: `Unnamed Title`,
                  },
                },
              })
              node.append(stepPane)
              // setCurrent(tabPane.id)
            },
          },
        ]}
      />
    </div>
  )
})

FormStep.StepPane = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormStep.Behavior = createBehavior(
  {
    name: 'FormStep',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormStep',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every(
          (node) => node.props['x-component'] === 'FormStep.StepPane'
        ),
      propsSchema: createVoidFieldSchema(AllSchemas.FormStep),
    },
    designerLocales: AllLocales.FormStep,
  },
  {
    name: 'FormStep.StepPane',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormStep.StepPane',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormStep',
      propsSchema: createVoidFieldSchema(AllSchemas.FormStep.StepPane),
    },
    designerLocales: AllLocales.FormStepPane,
  }
)

FormStep.Resource = createResource({
  icon: 'StepSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormStep',
      },
    },
  ],
})
