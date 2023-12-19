import { day19input } from "./day19input";

const smallRawInput = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

type MoveToAction = {
  type: "moveTo";
  workflowName: string;
};
type MoveAlongAction = {
  type: "moveAlong";
};
type RejectAction = {
  type: "reject";
};
type AcceptAction = {
  type: "accept";
};
type Action = MoveAlongAction | MoveToAction | RejectAction | AcceptAction;

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Condition = (part: Part) => boolean;

type WorkflowStep = {
  particleName: keyof Part;
  condition: Condition;
  action: Action;
};
type Workflow = {
  name: string;
  steps: WorkflowStep[];
  otherwise: Action;
};

type ParsedData = {
  workflows: Workflow[];
  parts: Part[];
};

const parseAction = (actionRaw: string): Action => {
  switch (actionRaw) {
    case "A": {
      return { type: "accept" };
    }
    case "R": {
      return { type: "reject" };
    }
    default: {
      return { type: "moveTo", workflowName: actionRaw };
    }
  }
};

const parseWorkflowStep = (workflowStepRaw: string): WorkflowStep => {
  const match = workflowStepRaw.match(/^(\w)(>|<)(\d+):(\w+)$/);
  if (!match) {
    throw Error(`could not parse workflow step "${workflowStepRaw}"`);
  }
  const [, particleNameRaw, operation, compareWithRaw, actionRaw] = match;
  const particleName = particleNameRaw as keyof Part;
  const compareWith = Number(compareWithRaw);
  const gt: Condition = (part) => part[particleName] > compareWith;
  const lt: Condition = (part) => part[particleName] < compareWith;
  const conditionsMap: Record<string, Condition> = { ">": gt, "<": lt };
  const condition = conditionsMap[operation];
  const action = parseAction(actionRaw);
  return { particleName, condition, action };
};

const parseWorkflow = (workflowRaw: string): Workflow => {
  const nameRe = /^(\w+)/;
  const nameMatch = workflowRaw.match(nameRe);
  if (!nameMatch) {
    throw Error(`could not parse workflow "${workflowRaw}"`);
  }
  const [, name] = nameMatch;
  const workflowStepsRaw = workflowRaw
    .replace(nameRe, "")
    .slice(1, -1)
    .split(",");
  const otherwise = parseAction(workflowStepsRaw.pop()!);
  const steps = workflowStepsRaw.map(parseWorkflowStep);
  return {
    name,
    steps,
    otherwise,
  };
};

const parsePart = (partRaw: string): Part => {
  const match = partRaw.match(/\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/);
  if (!match) {
    throw Error(`could not parse part "${partRaw}"`);
  }
  const [, x, m, a, s] = match.map(Number);
  return { x, m, a, s };
};

const parse = (rawInput: string): ParsedData => {
  const [workflowsRaw, partsRaw] = rawInput.trim().split("\n\n");
  return {
    workflows: workflowsRaw.split("\n").map(parseWorkflow),
    parts: partsRaw.split("\n").map(parsePart),
  };
};

const day19p1 = (rawInput: string) => {
  const { workflows, parts } = parse(rawInput);
  const workflowsDict: Record<string, Workflow> = workflows.reduce(
    (acc, workflow) => ({ ...acc, [workflow.name]: workflow }),
    {}
  );
  const runPartThroughWorkflows = (
    part: Part,
    workflowName: string
  ): boolean => {
    let workflow = workflowsDict[workflowName];
    const runAction = (action: Action): boolean => {
      switch (action.type) {
        case "moveAlong": {
          throw Error("i should delete this action");
        }
        case "moveTo": {
          return runPartThroughWorkflows(part, action.workflowName);
        }
        case "reject": {
          return false;
        }
        case "accept": {
          return true;
        }
      }
    };
    for (const { condition, action } of workflow.steps) {
      if (condition(part)) {
        return runAction(action);
      }
    }
    return runAction(workflow.otherwise);
  };

  return parts
    .filter((part) => runPartThroughWorkflows(part, "in"))
    .map(({ x, m, a, s }) => x + m + a + s)
    .reduce((a, b) => a + b, 0);
};

console.log(day19p1(smallRawInput));
console.log(day19p1(day19input));
