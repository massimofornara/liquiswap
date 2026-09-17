// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; 

/** 
 * @title LiquiSwapManager
 * @dev Gestisce lo swap a prezzo fisso e il trigger per l'off-ramp fiat con transazioni gasless.
 */
contract LiquiSwapManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20; 

    // Token accettato come pagamento di base (es. USDC o EURC su Base Mainnet)
    IERC20 public immutable paymentToken; 

    struct Pool {
        address creator;
        address tokenAddress;
        uint256 pricePerToken; // Espresso nei decimali del paymentToken (es. 6 decimali per USDC)
        uint256 availableLiquidity;
        bool isActive;
    } 

    // Mapping da Token Creato -> Dettagli della Pool
    mapping(address => Pool) public pools; 

    // Eventi speculari per l'indicizzazione dei sistemi di monitoraggio (Thirdweb Webhooks)
    event PoolCreated(address indexed creator, address indexed tokenAddress, uint256 pricePerToken);
    event SwapExecuted(address indexed buyer, address indexed tokenAddress, uint256 amountBought, uint256 totalCost);
    event OffRampTriggered(
        address indexed user,
        address indexed tokenPaid,
        uint256 amountIn,
        string targetIBAN,
        string accountHolderName
    ); 

    constructor(address _paymentToken) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid payment token");
        paymentToken = IERC20(_paymentToken);
    } 

    /** 
      * @notice Registra un nuovo token sulla piattaforma impostando un prezzo fisso.
      * @param _tokenAddress Indirizzo del token reale on-chain appena creato.
      * @param _pricePerToken Prezzo per singola unita di token (rapportato ai decimali del paymentToken).
      * @param _initialLiquidity Quantita di token depositata dal creatore della pool per la vendita.
    */
    function createPool(
        address _tokenAddress,
        uint256 _pricePerToken,
        uint256 _initialLiquidity
    ) external nonReentrant {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_pricePerToken > 0, "Price must be greater than zero");
        require(_initialLiquidity > 0, "Liquidity must be greater than zero");
        require(!pools[_tokenAddress].isActive, "Pool already exists"); 

        // Trasferisce i token reali dal wallet dell'utente al contratto
        IERC20(_tokenAddress).safeTransferFrom(msg.sender, address(this), _initialLiquidity); 

        pools[_tokenAddress] = Pool({
            creator: msg.sender,
            tokenAddress: _tokenAddress,
            pricePerToken: _pricePerToken,
            availableLiquidity: _initialLiquidity,
            isActive: true
        }); 

        emit PoolCreated(msg.sender, _tokenAddress, _pricePerToken);
    }

    /** 
      * @notice Esegue lo swap reale direttamente on-chain tra il wallet connesso e la pool.
    */
    function swapToken(address _tokenAddress, uint256 _tokenAmount) external nonReentrant {
        Pool storage pool = pools[_tokenAddress];
        require(pool.isActive, "Pool is not active");
        require(pool.availableLiquidity >= _tokenAmount, "Insufficient liquidity in pool"); 

        // Calcolo del costo totale (Prezzo * Quantita / Normalizzazione decimali)
        uint256 totalCost = (_tokenAmount * pool.pricePerToken) / 10**18;
        require(totalCost > 0, "Total cost too low"); 

        pool.availableLiquidity -= _tokenAmount; 

        // 1. Il compratore paga il prezzo stabilito in paymentToken al creatore della pool
        paymentToken.safeTransferFrom(msg.sender, pool.creator, totalCost); 

        // 2. Il contratto invia i token reali direttamente nel wallet non-custodial del compratore
        IERC20(_tokenAddress).safeTransfer(msg.sender, _tokenAmount); 

        emit SwapExecuted(msg.sender, _tokenAddress, _tokenAmount, totalCost);
    }

    /** 
      * @notice Consente all'utente di liquidare i propri asset on-chain scatenando l'Off-Ramp in EUR.
      * @param _amountIn Quantita di stabili/token che l'utente vuole convertire in Fiat EUR.
      * @param _targetIBAN Stringa dell'IBAN di destinazione.
      * @param _accountHolderName Intestatario del conto corrente bancario.
    */
    function triggerOffRamp(
        uint256 _amountIn,
        string calldata _targetIBAN,
        string calldata _accountHolderName
    ) external nonReentrant {
        require(_amountIn > 0, "Amount must be greater than zero");
        require(bytes(_targetIBAN).length > 0, "IBAN required"); 

        // Ritira i token stabilmente dal wallet dell'utente e li tiene nel contratto
        paymentToken.safeTransferFrom(msg.sender, address(this), _amountIn); 

        // Rilascia l'evento che il sistema userà per inviare il bonifico fiat reale tramite API
        emit OffRampTriggered(msg.sender, address(paymentToken), _amountIn, _targetIBAN, _accountHolderName);
    }

    /** 
      * @notice Permette al proprietario (o all'infrastruttura) di prelevare i token accumulati dall'offramp per liquidarli sui conti bancari collegati.
    */
    function withdrawOffRampFunds(address _to, uint256 _amount) external onlyOwner {
        paymentToken.safeTransfer(_to, _amount);
    }
}
