import { day25input } from "./day25input";

const smallRawInput = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

type Component = {
  name: string;
  connections: string[];
};
type Components = Record<string, Component>;

const parse = (rawInput: string): Components =>
  rawInput
    .trim()
    .split("\n")
    .reduce((acc, line) => {
      const name = line.slice(0, 3);
      const connections = line.slice(5).split(" ");
      if (!acc[name]) {
        acc[name] = {
          name,
          connections,
        };
      } else {
        acc[name].connections.push(...connections);
      }
      for (const connectionName of connections) {
        if (!acc[connectionName]) {
          acc[connectionName] = {
            name: connectionName,
            connections: [],
          };
        }
        acc[connectionName].connections.push(name);
      }
      return acc;
    }, {} as Components);

type Connection = [string, string];

const day25p1 = (rawInput: string) => {
  const components = parse(rawInput);
  const componentsNames = Object.keys(components);

  const inOrder = (con1: string, con2: string) =>
    con1 < con2 ? [con1, con2] : [con2, con1];
  const compNamesToConnections = (compNames: string[]) =>
    Array.from(
      new Set(
        compNames.flatMap((name) =>
          components[name].connections.map((con) =>
            inOrder(name, con).join("-")
          )
        )
      )
    ).map((con) => con.split("-") as Connection);
  const allConnections = compNamesToConnections(componentsNames);

  const connectionsToComponents = (connections: Connection[]): Components => {
    const components: Components = {};
    const addConnection = (from: string, to: string) => {
      if (!components[from]) {
        components[from] = {
          name: from,
          connections: [],
        };
      }
      components[from].connections.push(to);
    };
    for (const [from, to] of connections) {
      addConnection(from, to);
      addConnection(to, from);
    }
    return components;
  };

  const leastVisited = (allDistances: Record<string, Record<string, number>>) =>
    Object.entries(allDistances)
      .map(
        ([name, distances]) =>
          [name, Object.values(distances).reduce((a, b) => a + b, 0)] as const
      )
      .sort(([, a], [, b]) => a - b)
      .map(([a]) => a)
      .slice(0, 6);
  const goesThroughAll = (
    connections: Connection[]
  ):
    | { goesThroughAll: true }
    | { goesThroughAll: false; groups: [number, number] } => {
    const components = connectionsToComponents(connections);
    const visited = new Map<string, number>();
    const queue: string[] = [componentsNames[0]];
    while (queue.length) {
      const componentName = queue.shift()!;
      if (visited.has(componentName)) {
        visited.set(componentName, visited.get(componentName)! + 1);
        continue;
      }
      visited.set(componentName, 1);
      if (!components[componentName]) {
      }
      queue.push(...components[componentName].connections);
    }

    if (visited.size === componentsNames.length) {
      return { goesThroughAll: true };
    }

    return {
      goesThroughAll: false,
      groups: [visited.size, componentsNames.length - visited.size],
    };
  };

  const conEq = ([from1, to1]: Connection, [from2, to2]: Connection) =>
    from1 === from2 && to1 === to2;

  const findGroups = (candidateConnections: Connection[]): [number, number] => {
    const n = candidateConnections.length;

    for (let i = 0; i < n; i++) {
      const con1 = candidateConnections[i];
      for (let j = i + 1; j < n; j++) {
        const con2 = candidateConnections[j];
        for (let k = j + 1; k < n; k++) {
          const con3 = candidateConnections[k];
          const newConnections = allConnections.filter(
            (con) => !conEq(con, con1) && !conEq(con, con2) && !conEq(con, con3)
          );
          const goes = goesThroughAll(newConnections);
          if (goes.goesThroughAll) {
            continue;
          }
          return goes.groups;
        }
      }
    }
    throw Error("no three connections");
  };

  const buildDistances = (start: string) => {
    const queue: { compName: string; curDist: number }[] = [
      { compName: start, curDist: 0 },
    ];
    const visited = new Map<string, number>();
    while (queue.length) {
      const { compName, curDist } = queue.shift()!;
      if (visited.has(compName) && visited.get(compName)! < curDist) {
        continue;
      }
      visited.set(compName, curDist);
      for (const connection of components[compName].connections) {
        queue.push({ compName: connection, curDist: curDist + 1 });
      }
    }
    return visited;
  };

  const buildAllDistances = () => {
    const allDistances: Record<string, Record<string, number>> = {};
    for (const componentName of componentsNames) {
      const distances = buildDistances(componentName);
      allDistances[componentName] = {};
      for (const [name, dist] of distances.entries()) {
        allDistances[componentName][name] = dist;
      }
    }
    return allDistances;
  };

  const allDistances = buildAllDistances();
  const leastVisitedComponents = leastVisited(allDistances);
  const topConnections = compNamesToConnections(leastVisitedComponents);
  const [a, b] = findGroups(topConnections);
  return a * b;
};

console.log(day25p1(smallRawInput));
console.log(day25p1(day25input));
