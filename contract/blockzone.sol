// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }
}

contract Blockzones {
    using SafeMath for uint256;
    uint internal blockzonesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address[] public cartAddresses;
    address[] empty;

    struct Blockzone {
        address payable owner;
        string title;
        string description;
        string date;
        uint admissionFee;
        uint schoolFee;
        uint totalApplicants;
    }

    mapping (uint => Blockzone) internal blockzones;

    function addAdmission(
        string memory _title,
        string memory _description, 
        string memory _date,
        uint _admissionFee,
        uint _schoolFee
    ) public {
        uint _totalApplicants = 0;
        blockzones[blockzonesLength] = Blockzone(
            payable(msg.sender),
            _title,
            _description,
            _date,
            _admissionFee,
            _schoolFee,
            _totalApplicants
        );
        blockzonesLength++;
    }

    function getAdmission(uint _index) public view returns (
        address payable,
        string memory,
        string memory,
        string memory,
        uint,
        uint,
        uint
    ) {
        return (
            blockzones[_index].owner,
            blockzones[_index].title, 
            blockzones[_index].description, 
            blockzones[_index].date, 
            blockzones[_index].admissionFee,
            blockzones[_index].schoolFee,
            blockzones[_index].totalApplicants
        );
    }

    function applyForAdmission(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            blockzones[_index].owner,
            blockzones[_index].admissionFee.add(blockzones[_index].schoolFee)
          ),
          "Transfer failed."
        );
        blockzones[_index].totalApplicants++;
    }
}