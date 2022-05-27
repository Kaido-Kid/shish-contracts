// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '../utils/ContextMixin.sol';

contract CoolGirlNFT is ERC1155, ERC2981, Ownable, ContextMixin {
    using Strings for uint256;
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public editionLimitPerToken;
    string private _baseURI = '';
    string private _contractURI = '';

    mapping(uint256 => uint256) private _totalSupply;

    event PermanentURI(string _value, uint256 indexed _id);

    constructor() ERC1155('') {
        name = 'Cool Girl';
        symbol = 'CGRL';
        totalSupply = 1500;
        editionLimitPerToken = 1;
        _baseURI = 'ipfs://QmaxBCL3UGoYnqg8xhjREfxiDLCUDbmTkwj6AcbUZavXmp/';
        _setDefaultRoyalty(msg.sender, 500);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }
        // otherwise, use the default ERC1155.isApprovedForAll()
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(
            tokenId >= 1 && tokenId <= totalSupply,
            'ERC1155Metadata: URI query for nonexistent token'
        );
        return
            string(
                abi.encodePacked(_baseURI, Strings.toString(tokenId), '.json')
            );
    }

    function setDefaultRoyalty(address newReceiver, uint96 newFeeNumerator)
        public
        onlyOwner
    {
        _setDefaultRoyalty(newReceiver, newFeeNumerator);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // to restrict total supply
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                require(
                    ids[i] <= totalSupply,
                    'ERC1155: token ID exceeds totalSupply'
                );
                require(
                    _totalSupply[ids[i]] + amounts[i] <= editionLimitPerToken,
                    'ERC1155: mint amount exceeds editionLimitPerToken'
                );
                _totalSupply[ids[i]] += amounts[i];
            }
        }
    }

    // to freeze metadata for OpenSea
    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);

        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                // Signals frozen metadata for OpenSea
                emit PermanentURI(uri(ids[i]), ids[i]);
            }
        }
    }

    // for meta-transactions
    function _msgSender() internal view override returns (address) {
        return ContextMixin.msgSender();
    }

    // delete this to make contract immutable
    function setNewContractURI(string memory _uri) public onlyOwner {
        _contractURI = _uri;
    }

    // to add contract-level-metadata
    function contractURI() public view returns (string memory) {
        return _contractURI; // see: https://docs.opensea.io/docs/contract-level-metadata and set
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
