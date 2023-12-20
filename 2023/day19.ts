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
type RejectAction = {
  type: "reject";
};
type AcceptAction = {
  type: "accept";
};
type Action = MoveToAction | RejectAction | AcceptAction;

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
  conditionRaw: string;
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

const STARTING_CONSTRAINT: Constraint = { min: 1, max: 4000 };

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
  const conditionRaw = `${particleNameRaw}${operation}${compareWithRaw}`;
  return {
    particleName,
    condition,
    action,
    conditionRaw,
  };
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

const getWorkflowsDict = (workflows: Workflow[]): Record<string, Workflow> =>
  workflows.reduce(
    (acc, workflow) => ({ ...acc, [workflow.name]: workflow }),
    {}
  );

const runPartThroughWorkflowsFactory = (workflows: Workflow[]) => {
  const workflowsDict = getWorkflowsDict(workflows);
  const runPartThroughWorkflows = (
    part: Part,
    workflowName: string
  ): boolean => {
    let workflow = workflowsDict[workflowName];
    const runAction = (action: Action): boolean => {
      switch (action.type) {
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
  return runPartThroughWorkflows;
};

const day19p1 = (rawInput: string) => {
  const { workflows, parts } = parse(rawInput);

  const runPartThroughWorkflows = runPartThroughWorkflowsFactory(workflows);

  return parts
    .filter((part) => runPartThroughWorkflows(part, "in"))
    .map(({ x, m, a, s }) => x + m + a + s)
    .reduce((a, b) => a + b, 0);
};

type Node =
  | {
      type: "node";
      name: string;
      adjacents: Adjacent[];
    }
  | { type: "reject" }
  | { type: "accept" };

type Adjacent = {
  conditionRaw: string;
  conditions: ConditionP2[];
  node: Node;
};

type Operation = "<" | ">";

type ConditionP2 = {
  particleName: keyof Part;
  operation: Operation;
  compareWith: number;
};

const parseCondition = (
  conditionRaw: string,
  shouldReverse = false
): ConditionP2 => {
  const match = conditionRaw.match(/^(\w+)(>|<)(\d+)$/);
  if (!match) {
    throw Error(`can't parse condition "${conditionRaw}"`);
  }
  const [, particleNameRaw, operationRaw, compareWithRaw] = match;
  const reverseMap: Record<Operation, { to: Operation; mult: number }> = {
    ">": {
      to: "<",
      mult: 1,
    },
    "<": {
      to: ">",
      mult: -1,
    },
  };

  const operation = operationRaw as Operation;
  const compareWith = Number(compareWithRaw);

  return {
    particleName: particleNameRaw as keyof Part,
    operation: shouldReverse ? reverseMap[operation].to : operation,
    compareWith: shouldReverse
      ? compareWith + reverseMap[operation].mult
      : compareWith,
  };
};

const buildGraph = (workflows: Workflow[]): Node => {
  const workflowsDict = getWorkflowsDict(workflows);
  const visited = new Set<Node>();

  const graph: Node = {
    type: "node",
    name: "in",
    adjacents: [],
  };
  const queue: Node[] = [graph];
  const getNodeByAction = (action: Action): Node => {
    switch (action.type) {
      case "moveTo": {
        return {
          type: "node",
          name: action.workflowName,
          adjacents: [],
        };
      }
      case "reject": {
        return { type: "reject" };
      }
      case "accept": {
        return { type: "accept" };
      }
    }
  };

  while (queue.length) {
    const curNode = queue.shift()!;
    if (visited.has(curNode)) {
      continue;
    }
    visited.add(curNode);
    if (curNode.type === "reject") {
      continue;
    }
    if (curNode.type == "accept") {
      continue;
    }
    const workflow = workflowsDict[curNode.name];
    for (const step of workflow.steps) {
      const node = getNodeByAction(step.action);
      curNode.adjacents.push({
        conditionRaw: step.conditionRaw,
        conditions: [parseCondition(step.conditionRaw)],
        node,
      });
    }
    curNode.adjacents.push({
      conditionRaw: `not(${curNode.adjacents
        .map(({ conditionRaw }) => conditionRaw)
        .join(" && ")})`,
      conditions: curNode.adjacents.map(({ conditionRaw }) =>
        parseCondition(conditionRaw, true)
      ),
      node: getNodeByAction(workflow.otherwise),
    });
    for (const adj of curNode.adjacents) {
      queue.push(adj.node);
    }
  }
  return graph;
};

type PathStep = {
  name: string;
  conditionRaw: string;
  conditions: ConditionP2[];
  pathes: PathStep[];
};
type Path = PathStep;

const getPathesToA = (graph: Node) => {
  if (graph.type !== "node") {
    throw Error("bad graph");
  }
  const root: Path = {
    name: graph.name,

    conditionRaw: "",
    conditions: [],
    pathes: [],
  };

  const queue: { curNode: Node; curPath: Path }[] = [
    {
      curNode: graph,
      curPath: root,
    },
  ];
  while (queue.length) {
    const { curNode, curPath } = queue.shift()!;
    if (curNode.type === "accept") {
      continue;
    }
    if (curNode.type === "reject") {
      continue;
    }
    for (const { node, conditionRaw, conditions } of curNode.adjacents) {
      const nodeName = node.type === "node" ? node.name : node.type;
      const nextPath = {
        name: nodeName,
        conditionRaw,
        conditions,
        pathes: [],
      };
      curPath.pathes.push(nextPath);

      queue.push({ curNode: node, curPath: nextPath });
    }
  }
  return root;
};

type Constraint = {
  min: number;
  max: number;
};

type Constraints = Record<keyof Part, Constraint>;

const calcPathConstraints = (path: PathStep) => {
  const startingConstraint: Constraint = { min: 1, max: 4000 };
  const startConstraints: Constraints = {
    x: { ...startingConstraint },
    m: { ...startingConstraint },
    a: { ...startingConstraint },
    s: { ...startingConstraint },
  };
  const calc = (pathStep: PathStep, constraints: Constraints): number => {
    if (pathStep.name === "accept") {
      return calcCombinations(constraints);
    }
    if (pathStep.name === "reject") {
      return 0;
    }

    let count = 0;
    for (const path of pathStep.pathes) {
      const nextConstraints: Constraints = JSON.parse(
        JSON.stringify(constraints)
      );
      for (const { particleName, operation, compareWith } of path.conditions) {
        switch (operation) {
          case "<": {
            nextConstraints[particleName].max = compareWith - 1;
            constraints[particleName].min = compareWith;
            break;
          }
          case ">": {
            nextConstraints[particleName].min = compareWith + 1;
            constraints[particleName].max = compareWith;
            break;
          }
        }
      }
      count += calc(path, nextConstraints);
    }
    return count;
  };

  return calc(path, startConstraints);
};

const calcCombinations = ({ x, m, a, s }: Constraints) =>
  (x.max - x.min + 1) *
  (m.max - m.min + 1) *
  (a.max - a.min + 1) *
  (s.max - s.min + 1);

const day19p2 = (rawInput: string) => {
  const { workflows } = parse(rawInput);
  const graph = buildGraph(workflows);
  const pathes = getPathesToA(graph);
  return calcPathConstraints(pathes);
};

console.log(day19p1(smallRawInput));
console.log(day19p1(day19input));

console.log("\n ========== P2 ========= \n");
console.log(day19p2(smallRawInput));
console.log(day19p2(day19input));
