import React from 'react'
import BigNumber from 'bignumber.js'
import WarningBar from './warningbar.js'
import HostStatus from './hoststatus.js'

const Header = ({ numContracts, earned, expected, walletsize, walletLocked, working, connectable, hasCheckedConnectability }) => (
	<header className="header">
		<div className="title">Hosting</div>
		<div className="capsule">
			<div className="pod"><HostStatus working={working} connectable={connectable} hasCheckedConnectability={hasCheckedConnectability} /></div>
			<div className="pod" id="contacts">{numContracts} active contracts</div>
			<div className="pod" id="money">{earned} SC earned</div>
			<div className="pod" id="expected">{expected} SC expected</div>
		</div>
		{
			(new BigNumber(walletsize)).lessThan('20000') && !walletLocked ?
				<WarningBar title="Wallet balance too low." message="You must have at least 20,000 SC to host files." />
				: null
		}
	</header>
)

export default Header
