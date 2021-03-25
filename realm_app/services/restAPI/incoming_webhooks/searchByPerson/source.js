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

  var person_pipeline = [{$match: 
{ $text: { $search: data.personName } }
},
{ $limit: 10 },
{$lookup: {
  from: 'places',
  localField: 'born_in',
  foreignField: 'name',
  as: 'birthplace'
}}, {$unwind: {
  path: '$birthplace'
}}, {$lookup: {
  from: 'places',
  localField: 'lives_in',
  foreignField: 'name',
  as: 'home'
}}, {$unwind: {
  path: '$home'
}}, {$project: {
  _id:0,
  nodes: [{
    id: '$_id',
    label: '$fullname'
  },
  {
    id: '$birthplace.name',
    label: '$birthplace.name',
  },
  {
    id: '$home.name',
    label: '$home.name',
  },
  ],
  edges:[
     {
    from: '$_id',
    to: "$born_in",
    label: "born_in"
  },
  {
    from: '$_id',
    to: "$lives_in",
    label: "lives_in"
  },
  {
    from: '$home.name',
    to: '$home.part_of',
    label: "part_of"
  },
  {
    from: '$birthplace.name',
    to: '$birthplace.part_of',
    label: "part_of"
  }
  ]
}}];

  var person_nodes = await persons.aggregate(person_pipeline).toArray();

  var nodes = [];
  var edges = [];

  person_nodes.forEach(person => {
    //nodes.push(person.node);

    person.nodes.forEach(node => {
      nodes.push(node);
    });


    person.edges.forEach(edge => {
      edges.push(edge);
    });
  });

  const uniq_nodes = uniqByKeepFirst(nodes, it => it.id)
  var respDoc = { nodes: uniq_nodes, edges: edges };
  //console.log(JSON.stringify(respDoc));

  response.setBody(JSON.stringify(respDoc));
  return (JSON.stringify(respDoc));
};