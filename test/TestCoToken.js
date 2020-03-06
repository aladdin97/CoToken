//import truffle assertions
const truffleAssert = require('truffle-assertions')

// import web3

// import the contract artifact 
const CoToken  = artifacts.require('./CoToken.sol')

// test starts here
contract('CoToken', function (accounts) {
    // predefine the contract instance
    let CoTokenInstance
  
    // before each test, create a new contract instance
    beforeEach(async function () {
        CoTokenInstance = await CoToken.new()
    })

    //TESTING THE MINT FUNCTION

    it('should mint tokens correctly- update correct balance and update supply ', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(1)
        await CoTokenInstance.mint(accounts[1],1,{"from": accounts[1],"value":weiPrice})

        let totalSupply = await CoTokenInstance.totalSupply()
        let balance = await CoTokenInstance.balanceOf(accounts[1])
        let weiBalance = await CoTokenInstance.contractBalance()

        var ethBalance = weiBalance/1e18
        var ethPrice = weiPrice/1e18
        
        // console.log(typeof weiPrice )

        assert.equal(balance.toNumber(), 1, "Incorrect number of tokens were minted to address")
        assert.equal(totalSupply.toNumber(),1,"totalSupply was not updated")
        assert.equal(ethBalance,ethPrice,"Eth balance was not correctly updated")

        
      })

      it('should not mint more tokens if cap is reached', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(100)
        await CoTokenInstance.mint(accounts[1],100,{"from": accounts[1],"value":weiPrice})

        let totalSupply = await CoTokenInstance.totalSupply()
        let balance = await CoTokenInstance.balanceOf(accounts[1])
        await truffleAssert.reverts(CoTokenInstance.mint(accounts[1],100,{"from": accounts[1],"value":weiPrice}))
        
      })

      // END OF MINT FUNCTION TESTING 

      // TESTING OF BURN FUNCTION
      it('should be able to burn tokens and update respective CoToken and Eth balances', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(5)
        await CoTokenInstance.mint(accounts[0],5,{"from": accounts[0],"value":weiPrice})
        let weiCo_PrevBalance = await CoTokenInstance.weiBalance(accounts[0])

        await CoTokenInstance.burn(accounts[0], 5,{"from": accounts[0]})

        let totalSupply = await CoTokenInstance.totalSupply()
        let balance = await CoTokenInstance.balanceOf(accounts[0])

        let weiContractBalance = await CoTokenInstance.contractBalance()
        let weiCo_CurrentBalance = await CoTokenInstance.weiBalance(accounts[0])
        
        let weiSellPrice = await CoTokenInstance.sellPrice(5)

        var weiCoDiff = weiCo_CurrentBalance-weiCo_PrevBalance
        var ethCoBalance = weiCoDiff/1e18
        var ethBalance = weiContractBalance/1e18
        var ethSellPrice = weiSellPrice/1e18

        assert.equal(balance.toNumber(), 0, "Balance after burn is incorrect")
        assert.equal(totalSupply.toNumber(),0,"totalSupply after burn is incorrect")
        assert.equal(ethBalance,0,"Eth contract balance was not correctly updated")
        assert.equal(ethCoBalance.toFixed(3),ethSellPrice,"Co's Eth balance was not correctly updated")
        // round off to 3 decimals to account for gas costs
      }) 
      
      it('should not be able to burn more tokens than the current total supply', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(5)
        await CoTokenInstance.mint(accounts[0],5,{"from": accounts[0],"value":weiPrice})


        await truffleAssert.reverts(CoTokenInstance.burn(accounts[0], 6,{"from": accounts[0]}))
        
      })  

      it('should only burn if the owner (Co) calls the burn function', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(5)
        await CoTokenInstance.mint(accounts[1],5,{"from": accounts[1],"value":weiPrice})


        await truffleAssert.reverts(CoTokenInstance.burn(accounts[1], 5,{"from": accounts[1]}))
        
      })

      // END OF BURN FUNCTION TESTING 
      

      // TESTING OF DESTROY FUNCTION 
      it('should only destroy contract if the owner (Co) owns all 100 tokens', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(5)
        await CoTokenInstance.mint(accounts[0],5,{"from": accounts[0],"value":weiPrice})


        await truffleAssert.reverts(CoTokenInstance.destroy({"from": accounts[0]}))
        
      })

      it('should only destroy contract if the owner (Co) calls the destroy function', async function () {
        // minter is a public variable in the contract so you can get it directly via the created call function
        let weiPrice = await CoTokenInstance.buyPrice(100)
        await CoTokenInstance.mint(accounts[1],100,{"from": accounts[1],"value":weiPrice})


        await truffleAssert.reverts(CoTokenInstance.destroy({"from": accounts[1]}))
        
      })

    //   it('destroy function should destroy contract', async function () {
    //     // minter is a public variable in the contract so you can get it directly via the created call function
    //     let weiPrice = await CoTokenInstance.buyPrice(100)
    //     await CoTokenInstance.mint(accounts[0],100,{"from": accounts[0],"value":weiPrice})


    //     await CoTokenInstance.destroy({"from": accounts[0]})

    //     await truffleAssert.reverts(CoTokenInstance.buyPrice(5))
        
    //   })



     // END OF DESTROY FUNCTION TESTING



})