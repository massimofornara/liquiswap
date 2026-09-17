// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LiquiSwapManager {
    IERC20 public immutable paymentToken;
    address public owner;

    struct Pool {
        address creator;
        address tokenAddress;
        uint256 pricePerToken;
        uint256 availableLiquidity;
        bool isActive;
    }

    mapping(address => Pool) public pools;

    event PoolCreated(address indexed creator, address indexed tokenAddress, uint256 pricePerToken);
    event SwapExecuted(address indexed buyer, address indexed tokenAddress, uint256 amountBought, uint256 totalCost);
    event OffRampTriggered(
        address indexed user,
        address indexed tokenPaid,
        uint256 amountIn,
        string targetIBAN,
        string accountHolderName
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token");
        paymentToken = IERC20(_paymentToken);
        owner = msg.sender;
    }

    function createPool(address _tokenAddress, uint256 _pricePerToken, uint256 _initialLiquidity) external {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_pricePerToken > 0, "Price must be > 0");
        require(_initialLiquidity > 0, "Liquidity must be > 0");
        require(!pools[_tokenAddress].isActive, "Pool already exists");

        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _initialLiquidity), "Transfer failed");

        pools[_tokenAddress] = Pool({
            creator: msg.sender,
            tokenAddress: _tokenAddress,
            pricePerToken: _pricePerToken,
            availableLiquidity: _initialLiquidity,
            isActive: true
        });

        emit PoolCreated(msg.sender, _tokenAddress, _pricePerToken);
    }

    function swapToken(address _tokenAddress, uint256 _tokenAmount) external {
        Pool storage pool = pools[_tokenAddress];
        require(pool.isActive, "Pool not active");
        require(pool.availableLiquidity >= _tokenAmount, "Insufficient liquidity");

        uint256 totalCost = (_tokenAmount * pool.pricePerToken) / 10**18;
        require(totalCost > 0, "Cost too low");

        pool.availableLiquidity -= _tokenAmount;

        require(paymentToken.transferFrom(msg.sender, pool.creator, totalCost), "Payment failed");
        require(IERC20(_tokenAddress).transfer(msg.sender, _tokenAmount), "Token delivery failed");

        emit SwapExecuted(msg.sender, _tokenAddress, _tokenAmount, totalCost);
    }

    function triggerOffRamp(uint256 _amountIn, string calldata _targetIBAN, string calldata _accountHolderName) external {
        require(_amountIn > 0, "Amount must be > 0");
        require(bytes(_targetIBAN).length > 0, "IBAN required");

        require(paymentToken.transferFrom(msg.sender, address(this), _amountIn), "Offramp transfer failed");

        emit OffRampTriggered(msg.sender, address(paymentToken), _amountIn, _targetIBAN, _accountHolderName);
    }

    function withdrawOffRampFunds(address _to, uint256 _amount) external onlyOwner {
        require(paymentToken.transfer(_to, _amount), "Withdraw failed");
    }
}
