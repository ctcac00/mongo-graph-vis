function uniqByKeepFirst(a, key) {
  let seen = new Set();
  return a.filter(item => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

exports = async function (payload, response) {
  var data = EJSON.parse(payload.body.text());
  var persons = context.services.get("mongodb-atlas").db("placedata").collection("persons");
  var places = context.services.get("mongodb-atlas").db("placedata").collection("places");

  response.setHeader("Content-Type", "application/json");

  var place_pipeline = [{$match: {
  $text: {
    $search: data.placeName
  }
}}, {$graphLookup: {
  from: 'places',
  startWith: '$part_of',
  connectFromField: 'part_of',
  connectToField: 'name',
  as: 'belongsTo'
}}, {$unwind: {
  path: '$belongsTo'
}}, {$project: {
  _id: 0,
  nodes: [
    {
      id: '$_id',
      label: '$name'
    },
    {
      id: '$belongsTo._id',
      label: '$belongsTo.name'
    }
  ],
  edges: [
    {
      from: '$_id',
      to: '$belongsTo._id',
      label: 'part_of'
    }
  ]
}}];

  var places_nodes = await places.aggregate(place_pipeline).toArray();

  var nodes = [];
  var edges = [];

  places_nodes.forEach(place => {
    place.nodes.forEach(node => {
      nodes.push(node);
    });
    place.edges.forEach(edge => {
      edges.push(edge);
    });
  });

  const uniq_nodes = uniqByKeepFirst(nodes, it => it.label)
  var respDoc = { nodes: uniq_nodes, edges: edges };
  //console.log(JSON.stringify(respDoc));

  response.setBody(JSON.stringify(respDoc));
  return (JSON.stringify(respDoc));
};