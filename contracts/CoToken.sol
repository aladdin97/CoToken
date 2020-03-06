pragma solidity >=0.5.1;
// import "./Ownable.sol";
// import "./SafeMath.sol";
// import "./IERC20.sol";
// import "./ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract CoToken is Ownable, ERC20 {
using SafeMath for uint256;

    uint256 private _totalCap = 100;

    function buyPrice(uint n) public view returns (uint){
        // assuming we still integrate continously
        uint price = 5*(totalSupply() + n)*10**15 + 2*(totalSupply() + n)*10**17 - 5*(totalSupply())*10**15 - 2*(totalSupply())*10**17;
        return price;
        // returns price in wei
    }

    function sellPrice(uint n) public view returns (uint){
        // assuming we still integrate continously
        uint price = 5*(totalSupply())*10**15 + 2*(totalSupply())*10**17 - 5*(totalSupply() - n)*10**15 - 2*(totalSupply() - n)*10**17;
        return price;
        // returns price in wei
    }

    function mint(address account, uint256 amount) external payable {
        
        //check if value equals current price 
        require(msg.value == buyPrice(amount),"Price is not equal to current buyPrice");

        // make sure supply does not surpass totalCap
        require(totalSupply() < _totalCap, "Maximum number of allowable tokens already minted");

        _mint(account,amount);

    }

   
     
    function burn(address account, uint256 amount) external onlyOwner() {
        require(amount <= totalSupply(),"Amount requested to burn exceeds current supply");
        address payable owner = msg.sender;

        // determine amount of eth that needs to be sent back to the owner
        uint wei_2_return = sellPrice(amount);
    

        // // Prevent co from burning other peoples tokens ie he should only be able to burn tokens in his balance
        // require(account == msg.sender,"Co cannot burn tokens that are not in his account balance");


        _burn(account,amount);

        //transfer eth back to owner
        owner.transfer(wei_2_return);

        // uint256 price = sellPrice(amount);


    }

    function destroy() external  onlyOwner(){
        require(balanceOf(msg.sender) == 100, "Sender does not own all tokens");
        selfdestruct(msg.sender);
    }

    function weiBalance(address payable _address) public view returns (uint){
        return _address.balance;
    }

    function contractBalance() public view returns (uint){
        return address(this).balance;
    }


}