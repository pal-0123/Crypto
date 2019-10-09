pragma solidity ^0.5.0;

contract token{
    string  public name = "Token";
    string  public symbol = "T";
    string  public standard = "Token v1.0";
    uint256 private totalSupply;
    address owner;


    // address to balance
    mapping (address => uint256) public balanceOf;
    // userno. to address
    mapping (uint256 => address) public user;
    // userid to user no.
    mapping (uint256 => uint256) public userId;
    // creatorid to creator no.
    mapping (uint256 => uint256) public creatorId;
    // creator no. to address
    mapping (uint256 => address) public creator;
    uint256 userCount = 0;
    uint256 creatorCount = 0;

    event Transfer(
        address indexed _from,
        uint256 to,
        uint256 _value
    );

    event DistributeUser(
        uint256 toId,
        uint256 _value
    );

    event DistributeCreator(
        uint256 toId,
        uint256 _value
    );

    constructor (uint256 initialSupply) public {
        owner = msg.sender;
        totalSupply = initialSupply*100;
        balanceOf[owner] = totalSupply;
        creator[1] = owner;
        creatorCount ++;
    }

    // value passed as *100
    function transfer(uint256 to, uint256 value) public returns (bool){
        require(balanceOf[msg.sender] > value);
        
        require(creatorId[to] > 0);
        
        balanceOf[msg.sender] -= value;
        balanceOf[creator[creatorId[to]]] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    // return managed by /100
    function getBalance() public returns (uint256) {
        return balanceOf[msg.sender];
    }

    // return managed by /100
    function getBalanceUser(uint id) public returns (uint256) {
        require(msg.sender == owner);

        return balanceOf[user[userId[id]]];
    }
    
    // return managed by /100
    function getBalanceCreator(uint id) public returns (uint256) {
        require(msg.sender == owner);

        return balanceOf[creator[creatorId[id]]];
    }

    // value passed as *100
    function distributeUser(uint256 id, uint256 value) public {
        require(owner == msg.sender);

        require(balanceOf[msg.sender] > value);
        
        require(userId[id] > 0);

        balanceOf[msg.sender] -= value;
        balanceOf[user[userId[id]]] += value;

        emit DistributeUser(id,value);
    }

    // value passed as *100
    function distributeCreator(uint256 id, uint256 value) public returns (bool){
        require(owner == msg.sender);

        require(balanceOf[msg.sender] > value);

        require(creatorId[id] > 0);
        
        balanceOf[msg.sender] -= value;
        balanceOf[creator[creatorId[id]]] += value;

        emit DistributeCreator(id,value);

        return true;
    }

    function addCreator(uint256 id) public returns (bool){
        require(creatorId[id] == 0);

        balanceOf[msg.sender] = 1;
        
        creatorCount ++;
        creatorId[id] = creatorCount;
        creator[creatorCount] = msg.sender;
    }

    function addUser(uint256 id) public returns (bool){
        require(userId[id] == 0);

        balanceOf[msg.sender] = 1;

        userCount ++;
        userId[id] = userCount;
        user[userCount] = msg.sender;
    }
}
