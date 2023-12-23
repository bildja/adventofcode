export const day23input = `#.###########################################################################################################################################
#...........#...###...###.....#...#.......###...#...#.............#...#...#...#.......#.........#...###.....#.......#...#...#...#...#...#...#
###########.#.#.###.#.###.###.#.#.#.#####.###.#.#.#.#.###########.#.#.#.#.#.#.#.#####.#.#######.#.#.###.###.#.#####.#.#.#.#.#.#.#.#.#.#.#.#.#
#...#.......#.#...#.#...#...#.#.#.#.....#...#.#.#.#.#...........#.#.#.#.#.#.#.#.#.....#...#.....#.#...#.#...#.....#...#.#.#.#.#.#.#.#.#.#.#.#
#.#.#.#######.###.#.###.###.#.#.#.#####.###.#.#.#.#.###########.#.#.#.#.#.#.#.#.#.#######.#.#####.###.#.#.#######.#####.#.#.#.#.#.#.#.#.#.#.#
#.#...#.....#.#...#.#...###.#.#.#.#...#.#...#.#...#...#...#####.#.#.#...#.#.#.#.#...#.>.>.#.......#...#.#.......#.....#...#...#.#.#.#.#.#.#.#
#.#####.###.#.#.###.#.#####.#.#.#.#.#.#.#.###.#######.#.#.#####.#.#.#####.#.#.#.###.#.#v###########.###.#######.#####.#########.#.#.#.#.#.#.#
#.....#.#...#.#...#.#...#...#.#.#.#.#...#...#.......#...#.>.>.#.#.#.....#.#.#.#.#...#.#...#.........#...#.......#.....#...#...#...#.#.#.#.#.#
#####.#.#.###.###.#.###.#.###.#.#.#.#######.#######.#######v#.#.#.#####.#.#.#.#.#.###.###.#.#########.###.#######.#####.#.#.#.#####.#.#.#.#.#
#.....#.#...#.#...#...#.#...#.#.#.#.#.......###.....###.....#...#.#...#.#.#.#...#.....#...#...#.....#...#.###...#.......#...#...#...#.#.#.#.#
#.#####.###.#.#.#####.#.###.#.#.#.#.#.#########.#######.#########.#.#.#.#.#.###########.#####.#.###.###.#.###.#.###############.#.###.#.#.#.#
#...###.#...#.#.#...#.#...#.#.#.#.#.#.....#...#.......#.....#...#...#...#.#.#...........#.....#.#...###.#...#.#.#.....#...#...#.#.###.#...#.#
###.###.#.###.#.#.#.#.###.#.#.#.#.#.#####.#.#.#######.#####.#.#.#########.#.#.###########.#####.#.#####.###.#.#.#.###.#.#.#.#.#.#.###.#####.#
###...#.#...#.#.#.#.#.#...#.#.#.#.#.....#.#.#...#...#.###...#.#...#.....#...#.#.........#.#.....#...#...#...#.#.#...#.#.#.#.#...#...#.#.....#
#####.#.###v#.#.#.#.#.#.###.#.#.#.#####.#.#.###.#.#.#.###.###.###.#.###.#####.#.#######.#.#.#######.#.###.###.#.###.#.#.#.#.#######.#.#.#####
#...#...###.>.#...#...#...#.#.#.#.>.>.#.#.#.###.#.#.#...#...#.#...#.#...#.....#.#.......#...#.......#...#.###.#.###.#.#.#.#.....#...#.#.#####
#.#.#######v#############.#.#.#.###v#.#.#.#.###.#.#.###.###.#.#.###.#.###.#####.#.###########.#########.#.###.#.###.#.#.#.#####.#.###.#.#####
#.#.........#...#...#.....#.#.#.#...#...#.#...#.#.#.....#...#.#...#.#...#.....#.#.........###...#...>.>.#.#...#.#...#.#.#...#...#...#.#.....#
#.###########.#.#.#.#.#####.#.#.#.#######.###.#.#.#######.###.###.#.###.#####.#.#########.#####.#.###v###.#.###.#.###.#.###.#.#####.#.#####.#
#...#.........#...#.#.#...#.#...#.......#.....#.#.......#.....###.#.#...#...#.#.#.........#...#.#.#...###...#...#.###.#.#...#...###...#.....#
###.#.#############.#.#.#.#.###########.#######.#######.#########.#.#.###.#.#.#.#.#########.#.#.#.#.#########.###.###.#.#.#####.#######.#####
#...#...#.........#.#...#.#...#.........#.....#.#...#...#.......#...#.....#.#...#.........#.#.#.#.#...#...###...#...#.#.#.......#...###.....#
#.#####.#.#######.#.#####.###.#.#########.###.#.#.#.#.###.#####.###########.#############.#.#.#.#.###.#.#.#####.###.#.#.#########.#.#######.#
#.....#.#...#...#...#.....#...#.........#...#.#...#...###.....#.....#...#...#...#...#.....#.#.#...###...#...#...#...#...#.........#.........#
#####.#.###.#.#.#####.#####.###########.###.#.###############.#####.#.#.#.###.#.#.#.#.#####.#.#############.#.###.#######.###################
#.....#.#...#.#.#...#.......#.........#.#...#.......#...#...#.#...#...#...#...#.#.#.#.....#.#...#...#.......#.....###...#.......#...#.......#
#.#####.#.###.#.#.#.#########.#######.#.#.#########.#.#.#.#.#.#.#.#########.###.#.#.#####.#.###.#.#.#.###############.#.#######.#.#.#.#####.#
#.......#.....#.#.#.#.......#.......#.#.#...#.......#.#.#.#.#...#.......###...#.#.#.#.....#.#...#.#.#...............#.#.#...###...#...#.....#
###############.#.#.#.#####.#######.#.#.###.#.#######.#.#.#.###########.#####.#.#.#.#.#####.#.###.#.###############.#.#.#.#.###########.#####
###...........#...#...#.....#.......#...###.#.###...#.#.#.#.#...#.......#...#.#.#.#.#...#...#...#.#.#...............#.#.#.#.#.....#.....#####
###.#########.#########.#####.#############.#.###.#.#.#.#.#.#.#.#v#######.#.#.#.#.#.###v#.#####.#.#.#.###############.#.#.#.#.###.#.#########
#...#...#...#.........#.....#.........#.....#...#.#.#.#.#.#...#.>.>.#...#.#...#.#.#.#.>.>.#.....#.#.#...........#...#.#.#.#.#.#...#.........#
#.###.#.#.#.#########.#####.#########.#.#######.#.#.#.#.#.#######v#.#.#.#.#####.#.#.#.#v###.#####.#.###########v#.#.#.#.#.#.#.#.###########.#
#.#...#...#.........#.......#####...#.#.......#.#.#.#.#...#.....#.#.#.#.#.....#.#.#...#.###.#...#.#...#.......>.>.#.#.#.#.#.#.#.#...###...#.#
#.#.###############.#############.#.#.#######.#.#.#.#.#####.###.#.#.#.#.#####.#.#.#####.###.#.#.#.###.#.#######v###.#.#.#.#.#.#.#.#.###v#.#.#
#.#.#...............###...#...#...#...###...#.#...#.#.....#...#...#.#.#.#...#.#.#.#.....#...#.#.#.#...#...#...#...#.#.#.#.#.#.#...#...>.#.#.#
#.#.#.#################.#.#.#.#.#########.#.#.#####.#####.###.#####.#.#.#.#.#.#.#.#.#####.###.#.#.#.#####.#.#.###.#.#.#.#.#.#.#########v#.#.#
#.#.#.............#...#.#.#.#.#.....###...#.#.....#.....#.#...#...#...#.#.#.#.#.#.#.....#.....#.#.#.#.....#.#.#...#.#.#.#.#.#.#.........#...#
#.#.#############.#.#.#.#.#.#.#####.###.###.#####.#####.#.#.###.#.#####.#.#.#.#.#.#####.#######.#.#.#.#####.#.#.###.#.#.#.#.#.#.#############
#...#.......#.....#.#.#.#...#...#...#...###...#...#.....#.#.....#.....#.#.#...#...#####.......#...#...#...#.#...#...#.#.#.#.#.#.............#
#####.#####.#.#####.#.#.#######.#.###.#######.#.###.#####.###########.#.#.###################.#########.#.#.#####.###.#.#.#.#.#############.#
#...#.....#.#.....#.#.#...#.....#.#...###...#.#...#.......#.....#...#.#.#.#.......###...#...#.....###...#.#...#...#...#.#.#.#.#####...#.....#
#.#.#####.#.#####v#.#.###.#.#####v#.#####.#.#.###.#########.###.#.#.#.#.#.#.#####.###.#.#.#.#####.###.###.###.#.###.###.#.#.#.#####.#.#.#####
#.#.#.....#.#####.>.#.#...#.....>.>.#...#.#.#.....#...###...#...#.#...#...#.....#.#...#.#.#.#.....#...###.....#...#...#.#.#.#.#.....#...#...#
#.#.#.#####.#####v###.#.#########v###.#.#.#.#######.#.###.###.###.#############.#.#.###.#.#.#.#####.#############.###.#.#.#.#.#.#########.#.#
#.#.#.....#...#...#...#.....#...#.....#...#.....#...#.....###.....#...#...#.....#...###...#.#.#.....#...#...#...#.....#...#...#.........#.#.#
#.#.#####.###.#.###.#######.#.#.###############.#.#################.#.#.#.#.###############.#.#.#####.#.#.#.#.#.#######################.#.#.#
#.#...###.#...#...#.......#.#.#.................#.#.....#.......###.#.#.#.#.....#.....#...#...#.......#...#...#.......#...#.............#.#.#
#.###.###.#.#####.#######.#.#.###################.#.###.#.#####.###.#.#.#.#####.#.###.#.#.###########################.#.#.#.#############.#.#
#...#.....#.....#.#...###...#.........#...#.....#...###...#.....#...#.#.#...###...#...#.#.#...#...........#...#...#...#.#...#...#...#.....#.#
###.###########.#.#.#.###############.#.#.#.###.###########.#####.###.#.###.#######.###.#.#.#.#.#########.#.#.#.#.#.###.#####.#.#.#.#.#####.#
###.#...#.....#...#.#.#...#...###...#...#.#.#...#.........#.#...#.#...#...#...#...#.....#...#.#.#...#...#...#.#.#...###.......#...#...#...#.#
###.#.#.#.###.#####.#.#.#.#.#.###.#.#####v#.#.###.#######.#.#.#.#.#.#####.###.#.#.###########.#.#.#.#.#.#####.#.#######################.#.#.#
#...#.#...###...#...#.#.#...#.#...#.#...>.>.#...#.......#...#.#.#.#.#...#.#...#.#.#...........#...#...#.....#...###...#...###...#.......#...#
#.###.#########.#.###.#.#####.#.###.#.###v#####.#######v#####.#.#.#.#.#.#.#.###.#.#v#######################.#######.#.#.#.###.#.#.###########
#...#.#.....#...#...#...#.....#...#.#.#...#...#...#...>.>.#...#.#.#.#.#.#.#.#...#.>.>.........#.............#...#...#.#.#.#...#.#.......#...#
###.#.#.###.#v#####.#####.#######.#.#.#.###.#.###.#.###v#.#.###.#.#.#.#.#.#.#.#####v#########.#.#############.#.#.###.#.#.#.###.#######.#.#.#
###...#...#.#.>...#.....#.....#...#...#.....#...#...###.#.#...#.#.#.#.#.#.#.#.#####...#.......#.....#.....#...#.#...#.#.#.#...#.###.....#.#.#
#########.#.#v###.#####.#####.#.###############.#######.#.###.#.#.#.#.#.#.#.#.#######.#.###########.#.###.#.###.###.#.#.#.###.#.###.#####.#.#
#...#.....#...#...#...#.....#...#...........#...#.......#.....#.#.#.#.#.#.#.#.#.......#.#...###...#.#...#.#...#...#.#.#.#.#...#...#.......#.#
#.#.#.#########.###.#.#####.#####.#########.#.###.#############.#.#.#.#.#.#.#.#.#######.#.#.###.#.#v###.#.###.###.#.#.#.#.#.#####.#########.#
#.#.#.......###.....#...#...#.....#.......#.#...#.............#.#.#.#.#...#...#.......#.#.#...#.#.>.>...#...#.#...#.#.#.#.#...#...#...#...#.#
#.#.#######.###########.#.###.#####.#####.#.###.#############.#.#.#.#.###############.#.#.###.#.###v#######.#.#.###.#.#.#.###.#.###v#.#.#.#.#
#.#.......#...........#.#.###.#...#.#.....#.....#.............#.#.#.#.#.......#...#...#.#.###.#.###.#...###...#...#.#.#.#.#...#.#.>.#...#...#
#.#######.###########.#.#.###.#.#.#.#.###########.#############.#.#.#.#.#####.#.#.#.###.#.###.#.###.#.#.#########.#.#.#.#.#.###.#.#v#########
#.......#.#...........#.#.###...#...#.......#.....#...........#.#.#.#.#.#...#...#.#...#.#...#.#.#...#.#.......#...#.#...#.#...#...#...#.....#
#######.#.#.###########.#.#################.#.#####.#########.#.#.#.#.#.#.#.#####.###.#.###.#.#.#.###.#######.#.###.#####.###.#######.#.###.#
#.....#.#.#.......#...#...#...#.............#.......#.........#...#...#...#.....#.....#...#.#.#.#.....#...#...#...#.#.....#...###.....#.#...#
#.###.#.#.#######.#.#.#####.#.#.#####################.#########################.#########.#.#.#.#######.#.#.#####.#.#.#####.#####.#####.#.###
#...#...#.....#...#.#...#...#.#.....................#.....#.........#...#...#...#.....###...#.#.#.......#.#.#.....#.#.#...#...#...###...#...#
###.#########.#.###.###.#.###.#####################.#####.#.#######.#.#.#.#.#.###.###.#######.#.#.#######.#.#.#####.#.#.#.###.#.#####.#####.#
###...#.....#...###.#...#...#.#.....................###...#.#.......#.#...#.#...#.###.....###...#.......#...#...#...#.#.#.#...#.....#.#.....#
#####.#.###.#######.#.#####.#.#.#######################.###.#.#######.#####.###.#.#######.#############.#######.#.###.#.#.#.#######.#.#.#####
#.....#...#.#.......#...#...#.#...#.........#...#.......#...#...#...#.....#...#...###.....#...#.........#...###...###.#.#...#.....#...#.....#
#.#######.#.#.#########.#.###.###.#.#######.#.#.#.#######.#####.#.#.#####.###.#######.#####.#.#.#########.#.#########.#.#####.###.#########.#
#.#.......#.#...#.......#.#...###...#.....#...#.#...#...#.#.....#.#.#...#...#.#.......#...#.#.#...........#.........#...#...#...#...#.....#.#
#.#.#######.###.#.#######.#.#########.###.#####.###.#.#.#.#.#####.#.#.#.###.#.#.#######.#.#.#.#####################.#####.#.###.###.#.###.#.#
#...#.......#...#.#.....#.#...#.....#...#.......###...#.#.#.#...#.#.#.#.#...#.#.......#.#.#.#.#.....#.......#.......###...#.....###...###...#
#####v#######.###.#.###.#.###.#.###.###.###############v#.#.#.#.#.#.#.#.#.###.#######.#.#.#.#.#.###.#.#####.#.#########.#####################
#...#.>.#...#...#.#.#...#.#...#...#.###.#...#...#.....>.>.#...#.#.#.#.#.#...#.###...#.#.#.#.#.#...#.#...###...###...#...#...............#...#
#.#.#v#.#.#.###.#.#.#.###.#.#####.#.###v#.#.#.#.#.#####v#######.#.#.#.#.###.#.###.#.#v#.#.#.#.###.#.###v#########.#.#.###.#############.#.#.#
#.#...#.#.#.#...#.#.#.#...#...#...#.#.>.>.#...#.#.#...#.....###...#.#.#...#.#...#.#.>.>.#.#.#.#...#.#.>.>.###...#.#.#.....#...........#.#.#.#
#.#####.#.#.#.###.#.#.#.#####.#.###.#.#v#######.#.#.#.#####.#######.#.###.#.###.#.###v###.#.#.#.###.#.#v#.###.#.#.#.#######.#########.#.#.#.#
#.#...#...#...###...#.#.#.....#.###...#.......#...#.#.......#.....#.#.###.#...#...#...###...#...#...#.#.#...#.#.#.#...#...#.........#...#.#.#
#.#.#.###############.#.#.#####.#############.#####.#########.###.#.#.###.###.#####.#############.###.#.###.#.#.#.###.#.#.#########.#####.#.#
#.#.#...###...###...#...#.....#...#...........###...#...#...#.#...#...#...#...#...#.............#.#...#...#.#.#.#...#.#.#.#...#.....#.....#.#
#.#.###.###.#.###.#.#########.###.#.#############.###.#.#.#.#.#.#######.###.###.#.#############.#.#.#####.#.#.#.###.#.#.#.#.#.#v#####.#####.#
#...###...#.#.....#.........#.#...#.........#...#...#.#.#.#...#.......#.....###.#...#...#...#...#...#.....#...#...#.#.#.#.#.#.>.#...#...#...#
#########.#.###############.#.#.###########.#.#.###.#.#.#.###########.#########.###.#.#.#.#.#.#######.###########.#.#.#.#.#.###v#.#.###.#.###
#.........#.#.....#...#.....#...###.........#.#.#...#.#.#.#...#.......###.......###...#...#...#...###.......#.....#.#.#.#.#...#...#.....#...#
#.#########.#.###.#.#.#.###########.#########.#.#.###.#.#.#.#.#.#########.#####################.#.#########.#.#####.#.#.#.###.#############.#
#.........#.#...#.#.#...#.....#...#.......###.#.#.....#...#.#.#.........#...................#...#...#.......#.......#...#.#...#...........#.#
#########.#.###.#.#.#####.###.#.#.#######.###.#.###########.#.#########.###################.#.#####.#.###################.#.###.#########.#.#
#.........#.#...#...#...#...#.#.#.#...#...#...#.#.....#.....#.........#.###...#.......#.....#...#...#.......###...#...###...###.........#.#.#
#.#########.#.#######.#.###.#.#.#.#.#.#.###.###.#.###.#.#############.#.###.#.#.#####.#.#######.#.#########.###.#.#.#.#################.#.#.#
#.#.......#.#.....#...#.#...#...#...#...#...#...#...#.#.#.......#...#...#...#...#...#...#...#...#.#.......#...#.#...#.....#...#.........#...#
#.#.#####.#.#####.#.###.#.###############.###.#####.#.#.#.#####.#.#.#####.#######.#.#####.#.#.###.#.#####.###.#.#########.#.#.#.#############
#...#...#...#...#...#...#.#...#.......#...#...#...#.#.#...#...#.#.#.#...#.........#.#...#.#.#...#.#.....#.###.#.#.........#.#.#.............#
#####.#.#####.#.#####.###.#.#.#.#####.#.###.###.#.#.#.#####.#.#.#.#.#.#.###########.#.#.#.#.###.#.#####.#.###v#.#.#########.#.#############.#
#.....#.......#...#...###...#.#.#.....#.#...###.#.#.#.....#.#.#...#.#.#.###.........#.#.#.#...#.#.#...#.#...>.>.#.....#...#.#.#...###...#...#
#.###############.#.#########.#.#.#####.#.#####.#.#.#####.#.#.#####.#.#.###.#########.#.#.###.#.#.#.#.#.#####v#######.#.#.#.#.#.#.###.#.#.###
#...............#...###...###...#.....#.#.....#.#.#...#...#.#.#.....#.#...#.......###.#.#.#...#.#.#.#...#...#.#.......#.#...#.#.#.....#...###
###############.#######.#.###########.#.#####.#.#.###.#.###.#.#v#####.###.#######.###.#.#.#.###.#.#.#####.#.#.#.#######.#####.#.#############
#...............#.......#.#...#...###...###...#.#.....#.#...#.>.>.#...#...#...#...#...#...#.....#...###...#.#.#...#...#...#...#.......#...###
#.###############.#######.#.#.#.#.#########.###.#######.#.#####v#.#.###.###.#.#v###.###################.###.#.###.#.#.###.#.#########v#.#.###
#...............#.#.......#.#.#.#.....#.....###...###...#.#.....#.#...#...#.#.>.>...#...#...#...#...#...###.#...#.#.#...#.#.#...#...>.#.#...#
###############.#.#.#######.#.#.#####.#.#########.###.###.#.#####.###.###.#.###v#####.#.#.#.#.#.#.#.#.#####.###.#.#.###.#.#.#.#.#.###v#.###.#
#...............#.#.#...#...#.#.....#.#.......###...#.#...#...###...#.#...#.#...#...#.#...#.#.#...#...#...#.....#.#.#...#.#.#.#.#...#.#.#...#
#.###############.#.#.#.#.###.#####.#.#######.#####.#.#.#####.#####.#.#.###.#.###.#.#.#####.#.#########.#.#######.#.#.###.#.#.#.###.#.#.#.###
#...............#.#...#.#...#.#.....#...#.....#.....#.#.....#.....#...#.#...#...#.#...#.....#...#.......#.......#.#.#...#.#.#.#.#...#...#...#
###############.#.#####.###.#.#.#######.#.#####.#####.#####.#####.#####.#.#####.#.#####.#######.#.#############.#.#.###.#.#.#.#.#.#########.#
#.....#.....#...#...#...###.#.#...#.....#...###.###...#...#.#.....#...#...#####...#...#.....#...#.#.............#.#.#...#.#.#.#...#.........#
#.###.#.###.#v#####.#.#####.#.###.#.#######v###.###.###.#.#.#.#####.#.#############.#.#####.#.###.#.#############.#.#.###.#.#.#####.#########
#...#.#...#.#.>...#.#...#...#.#...#.#...#.>.>.#...#...#.#.#.#.....#.#.#...###.......#.#...#.#...#.#...........###...#.#...#.#...###.........#
###.#.###.#.#v###.#.###.#.###.#.###.#.#.#.#v#.###.###.#.#.#.#####.#.#.#.#.###.#######.#.#.#.###.#.###########.#######.#.###.###.###########.#
#...#...#.#.#...#...#...#.#...#...#.#.#...#.#...#...#...#...#...#...#...#...#.......#...#...###...###...#...#.#.......#...#.....#...........#
#.#####.#.#.###.#####.###.#.#####.#.#.#####.###.###.#########.#.###########.#######.#################.#.#.#.#.#.#########.#######.###########
#.....#...#...#.....#...#.#...#...#...#...#...#.....#.......#.#.............###...#...#...###...#.....#...#...#.#...#.....###...#...........#
#####.#######.#####.###.#.###.#.#######.#.###.#######.#####.#.#################.#.###.#.#.###.#.#.#############.#.#.#.#######.#.###########.#
#...#.......#.#...#.###...###.#.#.......#.....#.....#.....#.#.............#.....#.....#.#.###.#.#.......#.....#...#...###...#.#.............#
#.#.#######.#.#.#.#.#########.#.#.#############.###.#####.#.#############.#.###########.#.###.#.#######.#.###.###########.#.#.###############
#.#.........#...#...#...#...#.#.#...........###...#...#...#.#.........#...#.............#...#.#.#.......#.#...#...###...#.#.#.......#.......#
#.###################.#.#.#.#.#.###########.#####.###.#.###.#v#######.#.###################.#.#.#.#######.#.###.#.###.#.#.#.#######.#.#####.#
#...#...........###...#.#.#.#...###.........#...#.#...#...#.>.>...###...###...#.......#...#.#.#.#.........#...#.#.#...#...#.###.....#...#...#
###.#.#########.###.###.#.#.#######.#########.#.#.#.#####.#######.#########.#.#.#####.#.#.#.#.#.#############.#.#.#.#######.###.#######.#.###
#...#.#.........#...#...#.#...#...#.......#...#.#.#.#...#.#.......#...#...#.#.#.....#...#...#.#.#...#.......#.#.#.#.......#...#...#.....#...#
#.###.#.#########.###.###.###.#.#.#######.#.###.#.#.#.#.#.#.#######.#.#.#.#.#.#####.#########.#.#.#.#.#####.#.#.#.#######.###.###.#.#######.#
#.#...#.#...#...#...#.###.#...#.#.#...#...#...#...#.#.#...#.#...###.#.#.#.#.#.#####.#...#...#.#.#.#.#.#...#...#.#.#...###.#...###...#...#...#
#.#.###.#.#.#.#.###.#.###.#.###.#.#.#.#v#####.#####.#.#####.#.#.###.#.#.#.#.#.#####v#.#.#.#.#.#.#.#.#v#.#.#####.#.#.#.###.#.#########.#.#.###
#.#...#.#.#...#.#...#.#...#...#.#.#.#.>.>.#...###...#...#...#.#...#.#...#.#.#...#.>.>.#.#.#.#.#.#.#.>.>.#.#...#.#.#.#...#.#...#...#...#.#...#
#.###.#.#.#####.#.###.#.#####.#.#.#.#####.#.#####.#####.#.###.###.#.#####.#.###.#.#####.#.#.#.#.#.#######.#.#.#.#.#.###.#.###.#.#.#.###.###.#
#.#...#.#.#.....#.#...#...#...#.#.#.#.....#.....#...#...#.#...#...#...#...#...#.#.....#.#.#...#.#.#.......#.#.#.#.#...#.#.#...#.#.#.#...#...#
#.#.###.#.#.#####.#.#####.#.###.#.#.#.#########.###.#.###.#.###.#####.#.#####.#.#####.#.#.#####.#.#.#######.#.#.#.###.#.#.#.###.#.#.#.###v###
#.#...#.#.#.....#.#.#...#.#.#...#.#.#...#.....#.###...#...#.#...#...#.#.....#.#...#...#.#.....#.#.#...#...#.#.#.#.#...#.#.#.#...#.#.#...>.###
#.###.#.#.#####.#.#.#.#.#.#.#.###.#.###.#.###.#.#######.###.#.###.#.#.#####.#.###.#.###.#####.#.#.###.#.#.#.#.#.#.#.###.#.#.#.###.#.#####v###
#.#...#.#.#.....#.#.#.#...#.#.#...#...#.#.#...#.......#...#.#...#.#.#.###...#...#.#...#...#...#.#.###...#...#.#.#.#...#.#.#.#...#.#...#...###
#.#.###.#.#.#####.#.#.#####.#.#.#####.#.#.#.#########.###.#.###.#.#.#.###.#####.#.###.###.#.###.#.###########.#.#.###.#.#.#.###.#.###.#.#####
#.#...#.#.#...#...#.#...#...#.#...#...#.#.#.#...#.....#...#.#...#.#.#...#.#...#.#.#...#...#...#.#.#...........#.#.#...#.#.#...#.#.#...#.#...#
#.###.#.#.###.#.###.###.#.###.###.#.###.#.#.#.#.#.#####.###.#.###.#.###.#.#.#.#.#.#.###.#####.#.#.#.###########.#.#.###.#.###.#.#.#.###.#.#.#
#.....#...###...###.....#.....###...###...#...#...#####.....#.....#.....#...#...#...###.......#...#.............#...###...###...#...###...#.#
###########################################################################################################################################.#`;