// https://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes

function getCommonAncestor(node1 /*, node2, node3, ... nodeN */) {
    if (arguments.length < 2)
        throw new Error("getCommonAncestor: not enough parameters");

    var i,
        method = "contains" in node1 ? "contains" : "compareDocumentPosition",
        test   = method === "contains" ? 1 : 0x0010,
        nodes  = [].slice.call(arguments, 1);

    rocking:
    while (node1 = node1.parentNode) {
        i = nodes.length;
        while (i--) {
            if ((node1[method](nodes[i]) & test) !== test)
                continue rocking;
        }
        return node1;
    }

    return null;
}

//.contains() -> Cross Browser

function isChildOf(child, parent) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
}

module.exports = {
  getCommonAncestor,
  isChildOf
};
