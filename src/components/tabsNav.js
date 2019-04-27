import React, { useState } from 'react';
import Form from './form';
import OrderList from './orderList';
import ArchiveList from './archiveList';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ViewList from '@material-ui/icons/ViewList';
import Archive from '@material-ui/icons/Archive';
import Settings from '@material-ui/icons/Settings';

const TabsNav = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue)
    };

    return(
        <>
            <Tabs variant='fullWidth' color="primary"
                  centered
                  value={activeTab}
                  onChange={handleChange}
            >
                <Tab label='Orders'
                     icon={<ViewList />}
                />
                <Tab label='Archive'
                     icon={<Archive />}
                />
                <Tab label='Settings'
                     icon={<Settings />}
                />
            </Tabs>

            {activeTab === 0 && <><Form /><OrderList/></>}
            {activeTab === 1 && <ArchiveList />}
            {activeTab === 2 && <Settings />}

        </>
    )
};

export default TabsNav;
