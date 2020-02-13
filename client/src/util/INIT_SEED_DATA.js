export default {data:
                {
                    user: {
                        "_id":"5e28c5c685ffc434b337c269",
                        "username":"test_user",
                        "friends":[],
                        "groupInvites":[
                                        {"_id":"5e41bbfac6986fe54f1e8d22","groupName":"group_invite1","description":""},
                                        {"_id":"5e41bc76c6986fe54f1e8d23","groupName":"group_invite2","description":""},
                                        {"_id":"5e3eee8ae1c35bdd60ffb0bf","groupName":"group_invite3","description":""}
                                    ],
                        "friendInvites":[],
                        "blocked":[]
                    },
                    groups:[
                            {
                                "_id":"5e2a008c295fb74748745ab9",
                                "groupName":"test_group1",
                                "description":"A description of test_group1",
                                "messages":[
                                            {
                                                id: "5e28c5c685ffc434b337c269", 
                                                text:"This is message 1.", 
                                                time:"2020-01-22T22:02:35.511Z"
                                            },
                                            {
                                                id: "5e28c5bc85ffc434b337c264", 
                                                text:"This is message 2.", 
                                                time:"2020-01-22T22:03:36.511Z"
                                            },
                                            {
                                                id: "5e28c5c485ffc434b337c268", 
                                                text:"This is message 3.", 
                                                time:"2020-01-22T22:04:37.511Z"
                                            },
                                            {
                                                id: "5e28c5c485ffc434b337c268", 
                                                text:"This is message 4.", 
                                                time:"2020-01-22T22:04:37.511Z"
                                            }
                                            ],
                                "activeMembers":[
                                                {"_id":"5e28c5c685ffc434b337c269","username":"test_user1"},
                                                {"_id":"5e28c5bc85ffc434b337c264","username":"test_user2"},
                                                {"_id":"5e28c5c485ffc434b337c268","username":"test_user3"}
                                                ],
                                "pendingMembers":[],
                                "pendingRequests":[],
                                "blocked":[],
                                "creator":"5e28c5c685ffc434b337c269",
                                "admins":["5e28c5c685ffc434b337c269"]
                            },
                            {
                                "_id":"5e2a008c295fb74748745ab5",
                                "groupName":"test_group2",
                                "description":"A description of test_group2",
                                "messages":[
                                            {
                                                id: "5e28c5bc85ffc434b337c264", 
                                                text:"This is message 1.", 
                                                time:"2020-01-22T22:02:35.511Z"
                                            },
                                            {
                                                id: "5e28c5c485ffc434b337c268", 
                                                text:"This is message 2.", 
                                                time:"2020-01-22T22:03:36.511Z"
                                            },
                                            {
                                                id: "5e28c5c685ffc434b337c269", 
                                                text:"This is message 3.", 
                                                time:"2020-01-22T22:04:37.511Z"
                                            }
                                        ],
                                "activeMembers":[
                                                {"_id":"5e28c5bc85ffc434b337c264","username":"test_user2"},
                                                {"_id":"5e28c5c685ffc434b337c269","username":"test_user1"},
                                                {"_id":"5e28c5c485ffc434b337c268","username":"test_user3"}
                                                ],
                                "pendingMembers":[],
                                "pendingRequests":[],
                                "blocked":[],
                                "creator":"5e28c5bc85ffc434b337c264",
                                "admins":["5e28c5bc85ffc434b337c264"]
                            }
                            ],
                    selected:{
                                "_id":"5e2a008c295fb74748745ab9",
                                "name":"test_group1",
                                "type":"group",
                                "index":0
                            }
                }
            }
                                