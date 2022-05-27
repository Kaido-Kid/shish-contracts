import { randomBytes } from 'crypto'
import { ethers } from 'hardhat'
// import { ethers, run } from 'hardhat'
import { CoolGirlNFT__factory } from '../typechain-types'

async function main() {
  const [signer] = await ethers.getSigners()

  const coolGirlNFT = await new CoolGirlNFT__factory(signer).deploy()

  await coolGirlNFT.deployed()

  console.log('CoolGirlNFT deployed to: ', coolGirlNFT.address)

  // await run('verify:verify', {
  //   address: coolGirlNFT.address,
  //   contract: 'contracts/cool-girl-nft/CoolGirlNFT.sol:CoolGirlNFT'
  // })

  //
  // minting
  //

  console.log('Minting is started')

  const totalNfts: number = 1500

  // NFT's to mint in each transaction
  const mintSize: number = 100
  // tokenID to start the mint from
  const startTokenID: number = 1
  const maxTokenID = totalNfts
  for (let i = startTokenID; i <= maxTokenID; i += mintSize) {
    if (mintSize === 0) {
      throw new Error('Please specify greater than zero value for mintSize')
    }
    let currentMintSize = mintSize
    if (i + mintSize <= maxTokenID + 1) {
      currentMintSize = mintSize
    } else {
      // case when totalNfts is not a multiple of mintSize
      currentMintSize = maxTokenID - i + 1
    }
    // array containing tokenIds
    const ids = new Array(currentMintSize)
      .fill(0)
      .map((elem, index) => index + i)
    // array containing amount to mint for each tokenId, 1 in case of NFT's
    const amounts = new Array(currentMintSize).fill(1)
    console.log('Token Ids to be minted in current batch => ', ids)
    console.log(
      'Amounts to be minted for each Token Id in current batch => ',
      amounts
    )

    await coolGirlNFT.mintBatch(signer.address, ids, amounts, randomBytes(32))

    console.log('Successfully minted NFTs for current batch')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
