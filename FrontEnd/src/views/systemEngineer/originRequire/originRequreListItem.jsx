let IR_LIST = [...Array(8)].map((_, index) => ({
  id: 1,
  name: "赵光宇别摆烂了",
  description: "赵光宇摆烂两周了",
  creatorName: "赵光宇的父亲赵晨阳", // 创建者的username
  // functionalRequirementIds: [1, 2, 3], // 功能需求的id
  functionalRequirementIds: [
    {
      id: 0,
      name: "Funtional Requirement 1",
      description: "Functional Description 1",
    },
    {
      id: 1,
      name: "Funtional Requirement 2",
      description: "Functional Description 2",
    },
  ],
}));
