import './nftcard.css'

interface Attribute {
    trait_type: string;
    value: string;
}

interface NftCardProps {
    image: string;
    id: string;
    title: string;
    address: string;
    description?: string;
    attributes?: Attribute[];
}

const NftCard = ({ image, id, title, address, description, attributes }: NftCardProps) => {
    const idDecimal = parseInt(id, 16);
    return (
        <div className="nft-card">
            <img className='nft-image' key={id} src={image} alt={title} />
            <div className="nft-details">
                <div className="nft-info">
                    <h3 className="nft-title">Title: {title}</h3>
                    {`Contract Address: `}
                    <a target="_blank" className="contract-address" href={`https://sepolia.etherscan.io/token/${address}`} rel="noopener noreferrer">
                        {`${address.slice(0, 4)}...${address.slice(address.length - 4)}`}
                    </a>
                    <p>{`Token ID: ${idDecimal}`}</p>
                </div>
                <div className="nft-description">
                    <p>Description: {description ? description.slice(0, 200) : "No Description"}</p>
                </div>
            </div>
            <div className="nft-attributes">
                {attributes && attributes.length > 0 && attributes.map((attribute, index) => (
                    <div className="nft-attribute" key={index}>
                        <p className="attribute-type">{attribute.trait_type}:</p>
                        <p className="attribute-value">{attribute.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default NftCard;