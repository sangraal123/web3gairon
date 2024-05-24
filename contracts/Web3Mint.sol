// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ERC721.sol";
//OpenZeppelinが提供するヘルパー機能をインポートします。
import "./Counters.sol";
import "./Base64.sol";

contract Web3Mint is ERC721 {
    struct NftAttributes {
        string name;
        string imageURL;
    }

    using Counters for Counters.Counter;
    // tokenIdはNFTの一意な識別子で、0, 1, 2, .. N のように付与されます。
    Counters.Counter private _tokenIds;

    NftAttributes[] Web3Nfts;

    constructor() ERC721("Sample NFTs for ERC-6551 Demo", "CIT") {}

    uint256 public constant MAX_SUPPLY = 200;

    // ユーザーが NFT を取得するために実行する関数です。

    function mintIpfsNFT(string memory name, string memory imageURI) public returns (uint256) {
        require(_tokenIds.current() < MAX_SUPPLY, "Max supply reached");
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Web3Nfts.push(NftAttributes({name: name, imageURL: imageURI}));
        _tokenIds.increment();
        return newItemId;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}